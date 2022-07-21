import {
  ChangeEvent,
  useEffect,
  useState,
} from 'react';

import { CircularProgress } from '@material-ui/core';
import ChevronLeftRoundedIcon from '@material-ui/icons/ChevronLeftRounded';
import CloseIcon from '@material-ui/icons/Close';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import SearchIcon from '@material-ui/icons/Search';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
} from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

import ButtonAtom from '../../../../atoms/ButtonAtom';
import DivAtom from '../../../../atoms/DivAtom';
import H2Atom from '../../../../atoms/H2Atom';
import IconAtom from '../../../../atoms/IconAtom';
import InputAtom from '../../../../atoms/InputAtom';
import ParagraphAtom from '../../../../atoms/ParagraphAtom';
import { db } from '../../../../firebase';
import AccomodationTable from '../../../../organisms/quote/quotation/create-quotation/accomodation/AccomodationTable';
import Searchbar from '../../../../organisms/quote/quotation/create-quotation/accomodation/search-bar/Searchbar';
import { selectWith2NavbarHeight, selectWith2NavbarWidth } from '../../../../redux/containerSizeSlice';
import {
  fetchingDataIndicatorStyles,
  quoteCreateQuoteStyles,
} from '../../../../styles';
import { getDaysDifference, widthHeightDynamicStyle } from '../../../../utils/helpers';
import {
  FlexDirection,
  SettingsSingleInput,
  UserAccomodation,
} from '../../../../utils/types';

function Accomodation() {
  const height = useSelector(selectWith2NavbarHeight);
  const width = useSelector(selectWith2NavbarWidth);

  const [accomodationData, setAccomodationData] = useState<UserAccomodation[]>();
  const [selectedAccomodations, setSelectedAccomodations] = useState<UserAccomodation[]>([]);

  const [accomodationTypesData, setAccomodationTypesData] = useState<SettingsSingleInput[]>();
  const [roomTypesData, setRoomTypesData] = useState<SettingsSingleInput[]>();
  const [roomViewsData, setRoomViewsData] = useState<SettingsSingleInput[]>();
  const [roomGradingsData, setRoomGradingsData] = useState<SettingsSingleInput[]>();

  const [presetQuotesData, setPresetQuotesData] = useState<any[]>();

  const [selectedAccomodationsNights, setSelectedAccomodationsNights] = useState<string[]>([]);
  const [
    selectedAccomodationsRoomTypes,
    setSelectedAccomodationsRoomTypes,
  ] = useState<string[]>([]);

  const [
    selectedAccomodationsMealPlans,
    setSelectedAccomodationsMealPlans,
  ] = useState<string[]>([]);

  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const [deletingPresetQuote, setDeletingPresetQuote] = useState(false);

  const [showValidationErrorMessage, setShowValidationErrorMessage] = useState(false);
  const [showNoRateErrorMessage, setShowNoRateErrorMessage] = useState<any>([]);
  const [validationNightsRequired, setValidationNightsRequired] = useState(0);

  const { id: quoteId } = useParams<{ id: string }>();
  const history = useHistory();

  useEffect(() => {
    const getInitialData = async () => {
      const aData = (await getDocs(collection(db, 'Library Accomodation'))).docs;
      const atData = (await getDocs(collection(db, 'Settings Accomodation Types'))).docs;
      const rtData = (await getDocs(collection(db, 'Settings Room Types'))).docs;
      const vData = (await getDocs(collection(db, 'Settings Room Views'))).docs;
      const gData = (await getDocs(collection(db, 'Settings Room Gradings'))).docs;

      const accData = aData.map((dc) => dc.data());
      const accTypesData = atData.map((dc) => dc.data());
      const rTypesData = rtData.map((dc) => dc.data());
      const viewsData = vData.map((dc) => dc.data());
      const gradingsData = gData.map((dc) => dc.data());

      const accIds = aData.map((dc) => dc.id);
      const accTypesIds = atData.map((dc) => dc.id);
      const roomTypesIds = rtData.map((dc) => dc.id);
      const viewsIds = vData.map((dc) => dc.id);
      const gradingsIds = gData.map((dc) => dc.id);

      accIds.forEach((id, i) => {
        accData[i].id = id;
      });
      accTypesIds.forEach((id, i) => {
        accTypesData[i].id = id;
      });
      roomTypesIds.forEach((id, i) => {
        rTypesData[i].id = id;
      });
      viewsIds.forEach((id, i) => {
        viewsData[i].id = id;
      });
      gradingsIds.forEach((id, i) => {
        gradingsData[i].id = id;
      });

      const { accDetails } = JSON.parse(localStorage.getItem('Editing Quote')!).thisQuote;
      setSelectedAccomodations(accDetails.selectedAccomodations as UserAccomodation[]);
      setSelectedAccomodationsMealPlans(accDetails.selectedAccomodationsMealPlans);
      setSelectedAccomodationsRoomTypes(accDetails.selectedAccomodationsRoomTypes);
      setSelectedAccomodationsNights(accDetails.selectedAccomodationsNights);

      if (localStorage.getItem('New Quote Accomodation')) {
        const selectedAcc = JSON.parse(
          localStorage.getItem('New Quote Accomodation')!,
        );

        setSelectedAccomodations(selectedAcc.selectedAccomodations as UserAccomodation[]);
        setSelectedAccomodationsMealPlans(selectedAcc.selectedAccomodationsMealPlans);
        setSelectedAccomodationsRoomTypes(selectedAcc.selectedAccomodationsRoomTypes);
        setSelectedAccomodationsNights(selectedAcc.selectedAccomodationsNights);
      }

      setAccomodationData(accData as UserAccomodation[]);
      setAccomodationTypesData(accTypesData as SettingsSingleInput[]);
      setRoomTypesData(rTypesData as SettingsSingleInput[]);
      setRoomViewsData(viewsData as SettingsSingleInput[]);
      setRoomGradingsData(gradingsData as SettingsSingleInput[]);
    };

    getInitialData();
  }, []);

  useEffect(() => {
    const getInitialData = async () => {
      const pqData = (await getDocs(collection(db, 'Preset Quotes'))).docs;
      const presetData = pqData.map((dc) => dc.data());
      const presetIds = pqData.map((dc) => dc.id);

      presetIds.forEach((id, i) => {
        presetData[i].id = id;
      });

      setPresetQuotesData(presetData);
    };

    getInitialData();
  }, [deletingPresetQuote]);

  const addAccomodation = (acc: UserAccomodation) => {
    const customerDetails = JSON.parse(
      localStorage.getItem('New Quote Customer')!,
    ).data[0];

    if (selectedAccomodations.find((a) => a.name === acc.name)) {
      return;
    }

    const roomTypes = Object.keys(acc.categoryValues)
      .map((cat) => ({ value: cat, label: cat }));

    const roomTypeOptions = acc.rates
      .map((rate) => rate.newRateType)
      .map((rate) => ({ value: rate, label: rate }));

    const mealPlanOptions = acc.rates
      .map((rate) => rate.newMealPlan)
      .map((rate) => ({ value: rate, label: rate }));

    acc.nights = '1';
    acc.roomRate = '';
    acc.total = '';

    const adults = customerDetails[9];
    const children = customerDetails[10];
    let pax = Number(adults);
    children.forEach((child: string) => {
      if (Number(child) > 14) {
        pax += 1;
      }
    });

    if (pax > 3) {
      const totalGuests = Number(adults) + children.length;
      const initRooms = Number(customerDetails[19]) + (Math.floor(totalGuests / 3) + 1);

      customerDetails[19] = initRooms;
      localStorage.setItem(
        'New Quote Customer',
        JSON.stringify({
          data: [customerDetails],
        }),
      );

      acc.pax = 'Triple';
    } else {
      // eslint-disable-next-line no-nested-ternary
      acc.pax = pax === 1 ? 'Single' : pax === 2 ? 'Double' : 'Triple';
    }

    acc.roomType = roomTypes[0]?.value || roomTypeOptions[0].value;
    acc.mealPlan = mealPlanOptions[0].value;

    const tempAccomodation = [...selectedAccomodations];
    tempAccomodation.push(acc);
    setSelectedAccomodations(tempAccomodation);
  };

  const deleteAccomodation = (acc: UserAccomodation) => {
    const removeIndex = selectedAccomodations.findIndex((ac) => ac.id === acc.id);
    const tempAccomodationNights = [...selectedAccomodationsNights];
    const tempAccomodationRoomTypes = [...selectedAccomodationsRoomTypes];
    const tempAccomodationMealPlans = [...selectedAccomodationsMealPlans];
    const tempAccomodation = [...selectedAccomodations];
    tempAccomodationNights.splice(removeIndex, 1);
    tempAccomodationRoomTypes.splice(removeIndex, 1);
    tempAccomodationMealPlans.splice(removeIndex, 1);
    tempAccomodation.splice(removeIndex, 1);
    setSelectedAccomodationsNights(tempAccomodationNights);
    setSelectedAccomodationsRoomTypes(tempAccomodationRoomTypes);
    setSelectedAccomodationsMealPlans(tempAccomodationMealPlans);
    setSelectedAccomodations(tempAccomodation);
  };

  const continueToCosting = () => {
    setShowValidationErrorMessage(false);
    setShowNoRateErrorMessage([{ '': false }]);

    const customerDetails = JSON.parse(
      localStorage.getItem('New Quote Customer')!,
    ).data[0];

    // Subtract 1 to equal number of nights
    let nightsRequired = 0;
    if (customerDetails[16] === 'Not Specific') {
      nightsRequired = Number(customerDetails[17]) || 0;
    } else {
      nightsRequired = getDaysDifference(customerDetails[8], customerDetails[7]) || 0;
    }

    setValidationNightsRequired(nightsRequired);
    const totalUsedNights = selectedAccomodationsNights.reduce((prev, curr) => (
      prev + Number(curr)
    ), 0);

    if (nightsRequired !== totalUsedNights) {
      setShowValidationErrorMessage(true);
    } else {
      let validAndContinue = true;

      const tempAccomodation = [...selectedAccomodations];
      let noRateErr = tempAccomodation.map((a) => ({ [a.name]: false }));
      tempAccomodation.forEach((acc, index) => {
        acc.nights = selectedAccomodationsNights[index];
        acc.roomType = selectedAccomodationsRoomTypes[index];

        const children = customerDetails[10];
        const adults = Number(customerDetails[9]);
        // const days = nightsRequired + 1;
        // const needAdditionalBed = customerDetails[14];

        // eslint-disable-next-line max-len
        const mealPlanRates = acc.rates.filter((r) => r.newMealPlan === selectedAccomodationsMealPlans[index]);
        const cusCheckin = new Date(customerDetails[7]);
        const cusCheckout = new Date(customerDetails[8]);

        // Check if theres a meal plan rate that can hold range from checkin to checkout
        const rate = mealPlanRates.find((r) => (
          new Date(r.newRateStart) <= cusCheckin && new Date(r.newRateEnd) >= cusCheckin
          && new Date(r.newRateStart) <= cusCheckout && new Date(r.newRateEnd) >= cusCheckout
        ));

        if (!rate) {
          validAndContinue = false;
          const tempSetShowNoRateErrorMessage = [...noRateErr];
          tempSetShowNoRateErrorMessage[index] = { [acc.name]: true };
          noRateErr = tempSetShowNoRateErrorMessage;
          return;
        }

        const singleGuestPrice = Number(rate?.newSinglePrice.slice(1));
        const adultsPrice = adults * singleGuestPrice;

        let childrenPrice = 0;
        children.forEach((c: string) => {
          if (Number(c) <= 5) {
            childrenPrice += (singleGuestPrice / 2);
          } else {
            childrenPrice += singleGuestPrice;
          }
        });

        const roomPrice = adultsPrice + childrenPrice;

        // const roomTypeCost = acc.categoryValues[
        //   Object.keys(acc.categoryValues)
        //     .find((cat) => cat === selectedAccomodationsRoomTypes[index])!
        // ];

        // eslint-disable-next-line max-len
        // const totalSum = Number(roomPrice) + Number(roomTypeCost) + (needAdditionalBed ? Number(acc.additionalBedPrice) : 0);
        acc.roomRate = `$${roomPrice}`;
        acc.total = `$${roomPrice * nightsRequired * (Number(customerDetails[19]) || 1)}`;
      });

      setShowNoRateErrorMessage(noRateErr);

      if (!validAndContinue) {
        return;
      }

      localStorage.setItem('New Quote Accomodation', JSON.stringify({
        selectedAccomodationsRoomTypes,
        selectedAccomodationsMealPlans,
        selectedAccomodationsNights,
        selectedAccomodations: tempAccomodation,
      }));
      history.replace(`/quote/quotations/edit/${quoteId}/costing`);
    }
  };

  const setPresetPax = (presetSelectedAccs: any) => {
    const customerDetails = JSON.parse(
      localStorage.getItem('New Quote Customer')!,
    ).data[0];

    const adults = customerDetails[9];
    const children = customerDetails[10];
    let pax = Number(adults);
    children.forEach((child: string) => {
      if (Number(child) > 14) {
        pax += 1;
      }
    });

    if (pax > 3) {
      const totalGuests = Number(adults) + children.length;
      const initRooms = Number(customerDetails[19]) + (Math.floor(totalGuests / 3) + 1);

      customerDetails[19] = initRooms;
      localStorage.setItem(
        'New Quote Customer',
        JSON.stringify({
          data: [customerDetails],
        }),
      );

      presetSelectedAccs.forEach((acc: any) => {
        acc.pax = 'Triple';
      });
    } else {
      presetSelectedAccs.forEach((acc: any) => {
        // eslint-disable-next-line no-nested-ternary
        acc.pax = pax === 1 ? 'Single' : pax === 2 ? 'Double' : 'Triple';
      });
    }
  };

  const deletePresetQuote = async (quote: any) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this Preset Quote?');
    if (confirmDelete) {
      setDeletingPresetQuote(false);
      await deleteDoc(doc(db, 'Preset Quotes', quote.id));
      setDeletingPresetQuote(true);
    }
  };

  return (
    <DivAtom style={{ height: `${height}px` }}>
      <DivAtom style={quoteCreateQuoteStyles.header}>
        <IconAtom
          size="small"
          children={<ChevronLeftRoundedIcon />}
          style={quoteCreateQuoteStyles.backBtn}
          onClick={() => history.replace(`/quote/quotations/edit/${quoteId}/customer`)}
        />
        <H2Atom style={quoteCreateQuoteStyles.title} text="Accomodation" />
      </DivAtom>

      {(accomodationData && accomodationTypesData
        && roomTypesData && roomViewsData && roomGradingsData && presetQuotesData) ? (
          <>
            <ParagraphAtom
              style={{
                ...quoteCreateQuoteStyles.title,
                margin: '1rem 0 1rem 1rem',
              }}
              text="Preset Quotes"
            />
            <DivAtom style={quoteCreateQuoteStyles.tableContainer}>
              <DivAtom
                style={{
                  ...quoteCreateQuoteStyles.btnMainContainer,
                  flexDirection: widthHeightDynamicStyle(width, 768, 'column', 'row') as FlexDirection,
                }}
              >
                {presetQuotesData.map((quote, index) => (
                  <DivAtom style={quoteCreateQuoteStyles.presetQuoteButtonContainer}>
                    <ButtonAtom
                      text={quote.title}
                      key={index}
                      style={{
                        ...quoteCreateQuoteStyles.btn,
                        background: 'none',
                        flex: 1,
                        width: 'auto',
                        minWidth: widthHeightDynamicStyle(width, 768, '100%', '9rem'),
                      }}
                      onClick={() => {
                        setSelectedAccomodations(quote.selectedAccomodations);
                        setPresetPax(quote.selectedAccomodations);
                        setSelectedAccomodationsMealPlans(quote.selectedAccomodationsMealPlans);
                        setSelectedAccomodationsRoomTypes(quote.selectedAccomodationsRoomTypes);
                      }}
                      size="large"
                    />
                    <DivAtom
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '3rem',
                      }}
                    >
                      <IconAtom
                        size="small"
                        style={{ color: 'red' }}
                        onClick={() => deletePresetQuote(quote)}
                      >
                        <DeleteOutlinedIcon />
                      </IconAtom>
                    </DivAtom>
                  </DivAtom>
                ))}
              </DivAtom>
              <DivAtom style={quoteCreateQuoteStyles.searchContainer}>
                <InputAtom
                  placeholder="Search"
                  adornmentPosition="start"
                  fullWidth={width < 768}
                  value={search}
                  plain="false"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                  children={<SearchIcon />}
                  style={{ padding: '0.2rem' }}
                  onFocus={() => setSearchFocused(true)}
                />
                {searchFocused && (
                  <IconAtom
                    size="small"
                    style={{ color: 'black' }}
                    onClick={() => {
                      setSearchFocused(false);
                      setSearch('');
                    }}
                  >
                    <CloseIcon />
                  </IconAtom>
                )}
              </DivAtom>
              {searchFocused && (
                <DivAtom style={quoteCreateQuoteStyles.searchBar.wrapper}>
                  <Searchbar
                    searchTerm={search}
                    accomodationData={accomodationData}
                    accomodationTypesData={accomodationTypesData}
                    roomTypesData={roomTypesData}
                    roomViewsData={roomViewsData}
                    roomGradingsData={roomGradingsData}
                    addAccomodation={addAccomodation}
                  />
                </DivAtom>
              )}
              <AccomodationTable
                columns={[
                  'LOCATION',
                  'NIGHTS',
                  'CATEGORY',
                  'ACCOMODATION',
                  'PAX',
                  'ROOM TYPE',
                  'MEAL PLAN',
                  'CITY',
                  '',
                ]}
                selectedAccomodations={selectedAccomodations}
                selectedAccomodationsNights={selectedAccomodationsNights}
                selectedAccomodationsRoomTypes={selectedAccomodationsRoomTypes}
                selectedAccomodationsMealPlans={selectedAccomodationsMealPlans}
                setSelectedAccomodationsNights={setSelectedAccomodationsNights}
                setSelectedAccomodationsRoomTypes={setSelectedAccomodationsRoomTypes}
                setSelectedAccomodationsMealPlans={setSelectedAccomodationsMealPlans}
                deleteAccomodation={deleteAccomodation}
              />
            </DivAtom>

            {showValidationErrorMessage && (
              <ParagraphAtom
                text={`Please specify the same number of nights as your departure - check-in. (Nights required - ${validationNightsRequired})`}
                style={quoteCreateQuoteStyles.errorMsg}
              />
            )}
            {showNoRateErrorMessage?.some((rtErr: any) => Object.values(rtErr).includes(true)) && (
              <ParagraphAtom
                text={`
                  No available room rates for specified checkin and checkout dates for hotels:
                    ${showNoRateErrorMessage.map((rtErr: any) => Object.keys(rtErr)).join(', ')}
                  `}
                style={quoteCreateQuoteStyles.errorMsg}
              />
            )}

            <DivAtom
              style={{
                ...quoteCreateQuoteStyles.addBtnContainer,
                padding: widthHeightDynamicStyle(width, 768, '1rem', 0),
                margin: widthHeightDynamicStyle(
                  width,
                  768,
                  0,
                  quoteCreateQuoteStyles.addBtnContainer.margin,
                ),
              }}
            >
              <ButtonAtom
                size="large"
                text="Continue"
                disabled={accomodationData.length === 0}
                onClick={continueToCosting}
                style={{
                  ...quoteCreateQuoteStyles.addBtn,
                  width: widthHeightDynamicStyle(width, 768, '100%', '18%'),
                  margin: '0 0 1rem 0',
                }}
              />
            </DivAtom>
          </>
        ) : (
          <DivAtom style={fetchingDataIndicatorStyles.container}>
            <CircularProgress size={20} color="primary" />
          </DivAtom>
        )}
    </DivAtom>
  );
}

export default Accomodation;
