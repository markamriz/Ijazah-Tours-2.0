import { ChangeEvent, useEffect, useState } from 'react';

import {
  CircularProgress,
  TextField,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import axios from 'axios';
import { collection, getDocs } from 'firebase/firestore';
import { useSelector } from 'react-redux';

import ButtonAtom from '../../atoms/ButtonAtom';
import DivAtom from '../../atoms/DivAtom';
import InputAtom from '../../atoms/InputAtom';
import { db } from '../../firebase';
import { Hotels } from '../../hotels';
import FormControlInput from '../../molecules/FormControlInput';
import AccomodationCard from '../../organisms/compare-rates/AccomodationCard';
import { selectWithoutNavbarHeight, selectWithoutNavbarWidth } from '../../redux/containerSizeSlice';
import { compareRatesStyles, fetchingDataIndicatorStyles, libraryStyles } from '../../styles';
import {
  getDaysDifference,
  HOTELS_API_BASE_URL,
  HOTELS_API_HOST,
  RAPID_API_KEY,
  widthHeightDynamicStyle,
  AGGREGATOR_BASE_URL,
  AGGREGATOR_HOST,
} from '../../utils/helpers';
import { FlexDirection, CompareRatesAccomdation } from '../../utils/types';

function CompareRates() {
  const height = useSelector(selectWithoutNavbarHeight);
  const width = useSelector(selectWithoutNavbarWidth);

  const [search, setSearch] = useState('');
  const [invalidDate, setInvalidDate] = useState(false);

  const [checkin, setCheckin] = useState(new Date().toISOString().split('T')[0]);
  const [checkout, setCheckout] = useState(new Date().toISOString().split('T')[0]);
  const [guests, setGuests] = useState(0);

  const [accomodationData, setAccomodationData] = useState<CompareRatesAccomdation[]>();
  const [
    currentSearchedAccomodation,
    setCurrentSearchedAccomodation,
  ] = useState<CompareRatesAccomdation>();
  const [aggregatorAccomodations, setAggregatorAccomodations] = useState<any[]>();
  const [rapidApiAccomodation, setRapidApiAccomodation] = useState<any>();
  const [isFetchingData, setIsFetchingData] = useState(false);

  useEffect(() => {
    const getInitialData = async () => {
      const aData = (await getDocs(collection(db, 'Library Accomodation'))).docs;
      const accData = aData.map((dc) => dc.data());
      const accIds = aData.map((dc) => dc.id);
      accIds.forEach((id, i) => {
        accData[i].id = id;
      });

      accData.forEach((acc) => {
        acc.bookingEngine = 'Ijazah Tours';
        acc.roomTypes = Object.keys(acc.categoryValues)
          || acc.rates.map((r: { newRateType: string }) => r.newRateType);
        acc.accGradings = acc.gradings
          .filter((g: { checked: boolean }) => g.checked)
          .map((g: { val: string }) => g.val);
      });

      setAccomodationData(accData as CompareRatesAccomdation[]);
    };

    getInitialData();
  }, []);

  const searchAccomodation = async () => {
    setInvalidDate(false);
    setIsFetchingData(true);
    if (search.trim() === '') {
      setCurrentSearchedAccomodation(undefined);
      setAggregatorAccomodations(undefined);
      setIsFetchingData(false);
      return;
    }

    const currentDate = new Date().valueOf();
    if (new Date(checkin).valueOf() > new Date(checkout).valueOf()
      || new Date(checkin).valueOf() < currentDate) {
      setInvalidDate(true);
      return;
    }

    const nightsRequired = getDaysDifference(checkout, checkin) || 0;
    const selectedAccomodation = accomodationData!.find((acc) => (
      acc.name === search
    ));

    if (selectedAccomodation) {
      await searchAggregatorAPI(selectedAccomodation);
      await searchHotelsAPI(selectedAccomodation);

      const rate = selectedAccomodation.rates[0];
      const guestPrice = Number(rate.newSinglePrice.slice(1)) * guests;
      const temp = { ...selectedAccomodation };
      temp.total = `$${guestPrice * nightsRequired}`;
      setCurrentSearchedAccomodation(temp);
    }

    setIsFetchingData(false);
  };

  const searchAggregatorAPI = async (selectedAccomodation: CompareRatesAccomdation) => {
    const results = await axios.post(`${AGGREGATOR_BASE_URL}rates`, {
      hotelId: Hotels[selectedAccomodation.name as keyof typeof Hotels],
      checkIn: checkin,
      checkOut: checkout,
    }, {
      headers: {
        'X-RapidAPI-Host': AGGREGATOR_HOST,
        'X-RapidAPI-Key': RAPID_API_KEY,
      },
    });

    const requiredRates = results.data.rates?.filter((r: any) => (
      r.host.toLowerCase().includes('agoda') || r.host.toLowerCase().includes('booking')
      || r.host.toLowerCase().includes('tripadvisor')
    ));

    requiredRates.forEach((r: any) => {
      r.bookingEngine = r.host;
      r.name = selectedAccomodation.name;
      r.country = selectedAccomodation.country;
      r.city = selectedAccomodation.city;
      r.total = `$${(Number(r.rate) * guests) + (Number(r.taxes) * guests)}`;
      r.accGradings = [];
      r.roomTypes = [];
    });

    setAggregatorAccomodations(requiredRates || []);
  };

  const searchHotelsAPI = async (selectedAccomodation: CompareRatesAccomdation) => {
    const nightsRequired = getDaysDifference(checkout, checkin) || 0;

    const locationRes = await axios.get(`${HOTELS_API_BASE_URL}locations/v2/search`, {
      params: {
        query: 'sri lanka',
        currency: 'USD',
        locale: 'en_US',
      },
      headers: {
        'X-RapidAPI-Host': HOTELS_API_HOST,
        'X-RapidAPI-Key': RAPID_API_KEY,
      },
    });

    const locs = locationRes.data.suggestions?.find((s: { group: string }) => s.group === 'CITY_GROUP')?.entities;
    const destinationId = locs?.find((l: { name: string }) => (
      l.name?.toLowerCase().includes(selectedAccomodation.city.toLowerCase())
    ))?.destinationId;

    const propertiesRes = await axios.get(`${HOTELS_API_BASE_URL}properties/list`, {
      params: {
        destinationId,
        pageNumber: '1',
        pageSize: '25',
        checkIn: checkin,
        checkOut: checkout,
        adults1: '1',
        sortOrder: 'STAR_RATING_HIGHEST_FIRST',
        locale: 'en_US',
        currency: 'USD',
      },
      headers: {
        'X-RapidAPI-Host': HOTELS_API_HOST,
        'X-RapidAPI-Key': RAPID_API_KEY,
      },
    });

    const props = propertiesRes.data.data?.body?.searchResults?.results;
    const propId = props?.find((p: { name: string }) => (
      p.name?.toLowerCase().includes(selectedAccomodation.name.toLowerCase())
    ))?.id;

    const propertiesDetailsRes = await axios.get(`${HOTELS_API_BASE_URL}properties/get-details`, {
      params: {
        id: propId,
        checkIn: checkin,
        checkOut: checkout,
        adults1: guests,
        currency: 'USD',
        locale: 'en_US',
      },
      headers: {
        'X-RapidAPI-Host': HOTELS_API_HOST,
        'X-RapidAPI-Key': RAPID_API_KEY,
      },
    });

    const propDetails = propertiesDetailsRes.data.data?.body?.propertyDescription;
    propDetails.bookingEngine = 'Hotels.com';
    propDetails.accGradings = [`${propDetails.starRating} Star`];
    propDetails.city = selectedAccomodation.city;
    propDetails.country = selectedAccomodation.country;
    propDetails.total = `$${(propDetails.featuredPrice?.currentPrice?.plain || 0) * nightsRequired}`;
    propDetails.roomTypes = propDetails.roomTypeNames.filter((r: string) => r !== '');
    setRapidApiAccomodation(propDetails || []);
  };

  const RenderDetails = () => (
    // eslint-disable-next-line no-nested-ternary
    currentSearchedAccomodation && aggregatorAccomodations && rapidApiAccomodation ? (
      <DivAtom style={compareRatesStyles.detailsContainer}>
        <AccomodationCard accomodation={currentSearchedAccomodation} />
        {aggregatorAccomodations.map((acc, index) => (
          <AccomodationCard accomodation={acc} key={index} />
        ))}
        <AccomodationCard accomodation={rapidApiAccomodation} />
      </DivAtom>
    ) : isFetchingData ? (
      <DivAtom style={fetchingDataIndicatorStyles.container}>
        <CircularProgress size={20} color="primary" />
      </DivAtom>
    ) : (
      <></>
    )
  );

  return (
    <DivAtom style={compareRatesStyles.container}>
      <DivAtom
        style={{
          ...compareRatesStyles.innerContainer,
          ...compareRatesStyles.mainContainer,
          height: `${height}px`,
        }}
      >
        {accomodationData ? (
          <>
            <DivAtom
              style={{
                ...compareRatesStyles.toolsContainer,
                flexDirection: widthHeightDynamicStyle(width, 600, 'column', 'row') as FlexDirection,
              }}
            >
              <DivAtom
                style={{
                  ...compareRatesStyles.searchContainer,
                  margin: widthHeightDynamicStyle(width, 600, '0 0 1rem 0', '0 1rem 0 0'),
                }}
              >
                <Autocomplete
                  id="autocomplete-search-field"
                  freeSolo
                  onChange={(_, value) => setSearch(value || '')}
                  options={accomodationData.map((acc) => acc.name)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search"
                      style={{ width: '200px' }}
                    />
                  )}
                />
              </DivAtom>
              <InputAtom
                fullWidth={false}
                value={checkin}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setCheckin(e.target.value)}
                adornmentPosition="end"
                style={{
                  ...libraryStyles.textField,
                  margin: widthHeightDynamicStyle(width, 600, '0 0 1rem 0', '0 1rem 0 0'),
                }}
                type="date"
                minValue={new Date().toISOString().split('T')[0]}
              />
              <InputAtom
                fullWidth={false}
                value={checkout}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setCheckout(e.target.value)}
                adornmentPosition="end"
                style={{
                  ...libraryStyles.textField,
                  margin: widthHeightDynamicStyle(width, 600, '0 0 1rem 0', '0 1rem 0 0'),
                }}
                type="date"
                minValue={new Date().toISOString().split('T')[0]}
              />
            </DivAtom>
            <DivAtom
              style={{
                ...compareRatesStyles.toolsContainer,
                flexDirection: widthHeightDynamicStyle(width, 600, 'column', 'row') as FlexDirection,
                marginBottom: '2rem',
              }}
            >
              <FormControlInput
                margin="1rem 1rem 0 0"
                label="Guests"
                fullWidth
                multiline={false}
                rows={1}
                width="100px"
                value={guests}
                setValue={setGuests}
                placeholder="No. of Guests"
                type="number"
              />
              <ButtonAtom
                text="Search"
                style={{
                  ...compareRatesStyles.btn,
                  width: widthHeightDynamicStyle(width, 600, '100%', '11rem'),
                }}
                onClick={searchAccomodation}
                size="large"
                disabled={isFetchingData}
              />
            </DivAtom>
            {invalidDate && (
              <DivAtom style={{ paddingLeft: '1rem' }}>
                <p style={{ color: 'red', textAlign: 'center' }}>
                  {/* eslint-disable-next-line max-len */}
                  Invalid Date - please make sure that the selected dates are in the future and the checkout date is ahead of the checkin date
                </p>
              </DivAtom>
            )}

            <RenderDetails />
          </>
        ) : (
          <DivAtom style={fetchingDataIndicatorStyles.container}>
            <CircularProgress size={20} color="primary" />
          </DivAtom>
        )}
      </DivAtom>
    </DivAtom>
  );
}

export default CompareRates;
