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
import { useHistory } from 'react-router-dom';

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
import { addDays, getDaysDifference, widthHeightDynamicStyle } from '../../../../utils/helpers';
import {
  AccomodationNight,
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

  const [selectedAccomodationsPax, setSelectedAccomodationsPax] = useState<string[]>([]);
  const [
    selectedAccomodationsNights,
    setSelectedAccomodationsNights,
  ] = useState<AccomodationNight[]>([]);

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

      if (localStorage.getItem('New Quote Accomodation')) {
        const selectedAcc = JSON.parse(
          localStorage.getItem('New Quote Accomodation')!,
        );

        setSelectedAccomodations(selectedAcc.selectedAccomodations as UserAccomodation[]);
        setSelectedAccomodationsMealPlans(selectedAcc.selectedAccomodationsMealPlans);
        setSelectedAccomodationsPax(selectedAcc.selectedAccomodationsPax);
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
      // Obtain required number of rooms depending on pax --> Commenting atm
      const totalGuests = Number(adults) + children.length;
      const initRooms = Math.ceil(pax / 3);

      customerDetails[19] = initRooms;
      customerDetails.push(totalGuests);
      localStorage.setItem(
        'New Quote Customer',
        JSON.stringify({
          data: [customerDetails],
        }),
      );
    } else if (pax === 1) {
      // Set pax value if no select option (pax < 3)
      acc.pax = 'Single';
      setSelectedAccomodationsPax((prev) => [...prev, 'Single']);
    } else if (pax === 2) {
      acc.pax = 'Double';
      setSelectedAccomodationsPax((prev) => [...prev, 'Double']);
    } else {
      acc.pax = 'Triple';
      setSelectedAccomodationsPax((prev) => [...prev, 'Triple']);
    }

    acc.roomType = roomTypes[0]?.value || roomTypeOptions[0].value;
    acc.mealPlan = mealPlanOptions[0].value;

    const tempAccomodation = [...selectedAccomodations];
    // Signify that there will be multiple of the same accomodation due to pax > 3 OR rooms > 1
    if (customerDetails[19] > 1 || pax > 3) {
      const numberOfEntries = pax > 3 ? Math.ceil(pax / 3) : Number(customerDetails[19]);
      acc.isMultiple = true;
      const additionalEntry = { ...acc, isSubEntry: true };
      acc.additionalEntries = [];

      // Store the extra entries into the main accomodation for easy cost calculation
      for (let i = 0; i < numberOfEntries - 1; i += 1) {
        acc.additionalEntries.push(additionalEntry);
      }
      tempAccomodation.push(acc);

      // Add the additional entries
      for (let i = 0; i < numberOfEntries - 1; i += 1) {
        tempAccomodation.push(additionalEntry);
      }
    } else {
      tempAccomodation.push(acc);
    }
    setSelectedAccomodations(tempAccomodation);
  };

  const deleteAccomodation = (acc: UserAccomodation) => {
    const removeIndexes = selectedAccomodations.map((ac, i) => (ac.id === acc.id ? i : ''))
      .filter(String) as number[];

    // Each accomodation - with additional entries or not - will have only a single nights entry
    const removeNightIndex = selectedAccomodationsNights.findIndex((ac) => ac.accId === acc.id);

    const tempAccomodationNights = [...selectedAccomodationsNights];
    const tempAccomodationRoomTypes = [...selectedAccomodationsRoomTypes];
    const tempAccomodationMealPlans = [...selectedAccomodationsMealPlans];
    const tempAccomodationPax = [...selectedAccomodationsPax];
    const tempAccomodation = [...selectedAccomodations];

    tempAccomodationRoomTypes.splice(removeIndexes[0], removeIndexes.length);
    tempAccomodationMealPlans.splice(removeIndexes[0], removeIndexes.length);
    tempAccomodationPax.splice(removeIndexes[0], removeIndexes.length);
    tempAccomodation.splice(removeIndexes[0], removeIndexes.length);
    tempAccomodationNights.splice(removeNightIndex, 1);

    setSelectedAccomodationsNights(tempAccomodationNights);
    setSelectedAccomodationsRoomTypes(tempAccomodationRoomTypes);
    setSelectedAccomodationsMealPlans(tempAccomodationMealPlans);
    setSelectedAccomodationsPax(tempAccomodationPax);
    setSelectedAccomodations(tempAccomodation);
  };

  const continueToCosting = () => {
    setShowValidationErrorMessage(false);
    setShowNoRateErrorMessage([{ '': false }]);

    const customerDetails = JSON.parse(
      localStorage.getItem('New Quote Customer')!,
    ).data[0];

    let nightsRequired = 0;
    if (customerDetails[16] === 'Not Specific') {
      nightsRequired = Number(customerDetails[17]) || 0;
    } else {
      nightsRequired = getDaysDifference(customerDetails[8], customerDetails[7]) || 0;
    }

    setValidationNightsRequired(nightsRequired);
    const totalUsedNights = selectedAccomodationsNights.map((x) => x.nights)
      .reduce((prev, curr) => (
        prev + Number(curr)
      ), 0);

    if (nightsRequired !== totalUsedNights) {
      setShowValidationErrorMessage(true);
    } else {
      const tempAccomodation = [...selectedAccomodations];

      const requireAdditionalBed = customerDetails[14];
      const customerRooms = Number(customerDetails[19]) || 1;

      let validAndContinue = true;
      let noRateErr = tempAccomodation.map((a) => ({ [a.name]: false }));
      let tempCurrDate = new Date(customerDetails[7]);

      tempAccomodation.forEach((acc, index) => {
        const additionalBedPrice = requireAdditionalBed ? Number(acc.additionalBedPrice) : 0;

        acc.roomType = selectedAccomodationsRoomTypes[index];
        acc.pax = selectedAccomodationsPax[index];

        // If there are multiple entries for the same accomodation,
        // use the first entry's date & nights
        if (acc.additionalEntries || !acc.isMultiple) {
          const thisAccomodationsNights = selectedAccomodationsNights.find((x) => (
            x.accId === acc.id
          ))!.nights;
          const thisAcomodationsCheckin = tempCurrDate.toISOString().substring(0, 10);
          const thisAccomodationsCheckout = addDays(tempCurrDate, Number(thisAccomodationsNights));

          acc.nights = thisAccomodationsNights;
          acc.checkin = thisAcomodationsCheckin;
          acc.checkout = thisAccomodationsCheckout;
          if (acc.additionalEntries) {
            acc.additionalEntries.forEach((ae) => {
              ae.checkin = thisAcomodationsCheckin;
              ae.checkout = thisAccomodationsCheckout;
              ae.nights = thisAccomodationsNights;
            });
          }

          tempCurrDate = new Date(acc.checkout);
        }

        const mealPlanRates = acc.rates.filter((r) => (
          r.newMealPlan === selectedAccomodationsMealPlans[index]
          && r.newRateType === selectedAccomodationsRoomTypes[index]
        ));

        // Step one - try to obtain a perfect rate (where it lies within the range)
        // Step two - check if checkin is within range of one rate and checkout wihin another
        const perfectRate = mealPlanRates.find((r) => (
          new Date(r.newRateStart) <= new Date(acc.checkin)
          && new Date(r.newRateEnd) >= new Date(acc.checkin)
          && new Date(r.newRateStart) <= new Date(acc.checkout)
          && new Date(r.newRateEnd) >= new Date(acc.checkout)
        ));

        if (acc.isSubEntry && Object.keys(acc.categoryValues).includes(acc.roomType)
        && !mealPlanRates.find((r) => r.newRateType === acc.roomType)) {
          const supplementCost = Number(acc.categoryValues[acc.roomType]);
          const mainAcc = tempAccomodation.find((x) => (
            x.id === acc.id && x.additionalEntries
          ));

          if (mainAcc?.roomRatesExtra) {
            // Main accomodation has a range rate
            const mainAccRangeRates = mainAcc.rangeRates;

            const singleGuestPrices = [
              Number(mainAccRangeRates[0]?.newSinglePrice.slice(1)),
              Number(mainAccRangeRates[1]?.newSinglePrice.slice(1)),
            ];
            const doubleGuestPrices = [
              Number(mainAccRangeRates[0]?.newDoublePrice.slice(1)),
              Number(mainAccRangeRates[1]?.newDoublePrice.slice(1)),
            ];
            const tripleGuestPrices = [
              Number(mainAccRangeRates[0]?.newTriplePrice.slice(1)),
              Number(mainAccRangeRates[1]?.newTriplePrice.slice(1)),
            ];

            let roomPrices = singleGuestPrices;
            if (acc.pax === 'Double') {
              roomPrices = doubleGuestPrices;
            } else if (acc.pax === 'Triple') {
              roomPrices = tripleGuestPrices;
            }

            const firstRatePrice = roomPrices[0] + additionalBedPrice + supplementCost;
            const secondRatePrice = roomPrices[1] + additionalBedPrice + supplementCost;

            acc.roomRatesExtra = [
              {
                nights: mainAccRangeRates[0].nights,
                rate: `$${firstRatePrice}`,
              },
              {
                nights: mainAccRangeRates[1].nights,
                rate: `$${secondRatePrice}`,
              },
            ];

            acc.roomRate = `
              $${firstRatePrice} for ${mainAccRangeRates[0].nights} ${mainAccRangeRates[0].nights === 1 ? 'night' : 'nights'},
              $${secondRatePrice} for ${mainAccRangeRates[1].nights} ${mainAccRangeRates[1].nights === 1 ? 'night' : 'nights'}
            `;
            acc.total = 'N/A';
          } else {
            // Main accomodation has a perfect rate
            const mainAccPerfectRate = mainAcc?.perfectRate!;
            const singleGuestPrice = Number(mainAccPerfectRate.newSinglePrice.slice(1));
            const doubleGuestPrice = Number(mainAccPerfectRate.newDoublePrice.slice(1));
            const tripleGuestPrice = Number(mainAccPerfectRate.newTriplePrice.slice(1));

            let roomPrice = singleGuestPrice;
            if (acc.pax === 'Double') {
              roomPrice = doubleGuestPrice;
            } else if (acc.pax === 'Triple') {
              roomPrice = tripleGuestPrice;
            }

            const ratePrice = roomPrice + additionalBedPrice + supplementCost;
            acc.roomRate = `$${ratePrice}`;
            acc.total = 'N/A';
          }
        } else if (!perfectRate) {
          // Attempt to find rates that covers the checkin and checkout
          const rangeRates: any = [];
          const firstRate = mealPlanRates.find((r) => (
            (new Date(r.newRateStart) <= new Date(acc.checkin)
              && new Date(r.newRateEnd) >= new Date(acc.checkin))
          ));
          const secondRate = mealPlanRates.find((r) => (
            (new Date(r.newRateStart) <= new Date(acc.checkout)
              && new Date(r.newRateEnd) >= new Date(acc.checkout))
          ));

          if (firstRate) {
            rangeRates.push(firstRate);
          }
          if (secondRate) {
            rangeRates.push(secondRate);
          }

          if (!rangeRates.length || rangeRates.length === 1) {
            validAndContinue = false;
            const tempSetShowNoRateErrorMessage = [...noRateErr];
            tempSetShowNoRateErrorMessage[index] = { [acc.name]: true };
            noRateErr = tempSetShowNoRateErrorMessage;
            return;
          }

          rangeRates[0].nights = getDaysDifference(rangeRates[0].newRateEnd, acc.checkin) + 1;
          rangeRates[1].nights = getDaysDifference(acc.checkout, rangeRates[0].newRateEnd) - 1;
          const singleGuestPrices = [
            Number(rangeRates[0]?.newSinglePrice.slice(1)),
            Number(rangeRates[1]?.newSinglePrice.slice(1)),
          ];
          const doubleGuestPrices = [
            Number(rangeRates[0]?.newDoublePrice.slice(1)),
            Number(rangeRates[1]?.newDoublePrice.slice(1)),
          ];
          const tripleGuestPrices = [
            Number(rangeRates[0]?.newTriplePrice.slice(1)),
            Number(rangeRates[1]?.newTriplePrice.slice(1)),
          ];

          let roomPrices = singleGuestPrices;
          if (acc.pax === 'Double') {
            roomPrices = doubleGuestPrices;
          } else if (acc.pax === 'Triple') {
            roomPrices = tripleGuestPrices;
          }

          const firstRatePrice = roomPrices[0] + additionalBedPrice;
          const secondRatePrice = roomPrices[1] + additionalBedPrice;

          acc.roomRatesExtra = [
            {
              nights: rangeRates[0].nights,
              rate: `$${firstRatePrice}`,
            },
            {
              nights: rangeRates[1].nights,
              rate: `$${secondRatePrice}`,
            },
          ];

          acc.rangeRates = rangeRates;
          acc.roomRate = `
            $${firstRatePrice} for ${rangeRates[0].nights} ${rangeRates[0].nights === 1 ? 'night' : 'nights'},
            $${secondRatePrice} for ${rangeRates[1].nights} ${rangeRates[1].nights === 1 ? 'night' : 'nights'}
          `;

          if (acc.additionalEntries) {
            acc.total = 'PENDING';
          } else if (acc.isMultiple) {
            acc.total = 'N/A';
          } else {
            acc.total = `$
              ${(customerRooms * firstRatePrice * rangeRates[0].nights)
              + (customerRooms * secondRatePrice * rangeRates[1].nights)}
            `;
          }
        } else {
          const singleGuestPrice = Number(perfectRate?.newSinglePrice.slice(1));
          const doubleGuestPrice = Number(perfectRate?.newDoublePrice.slice(1));
          const tripleGuestPrice = Number(perfectRate?.newTriplePrice.slice(1));

          let roomPrice = singleGuestPrice;
          if (acc.pax === 'Double') {
            roomPrice = doubleGuestPrice;
          } else if (acc.pax === 'Triple') {
            roomPrice = tripleGuestPrice;
          }

          const ratePrice = roomPrice + additionalBedPrice;
          acc.perfectRate = perfectRate;
          acc.roomRate = `$${ratePrice}`;

          if (acc.additionalEntries) {
            acc.total = 'PENDING';
          } else if (acc.isMultiple) {
            acc.total = 'N/A';
          } else {
            acc.total = `$${ratePrice * nightsRequired * customerRooms}`;
          }
        }
      });

      setShowNoRateErrorMessage(noRateErr);

      if (!validAndContinue) {
        return;
      }

      // Additional entries rates have been set above - this will update the nested sub array
      const temp2Accomodation = [...tempAccomodation];
      temp2Accomodation.forEach((acc) => {
        if (acc.additionalEntries) {
          const updatedEntries = tempAccomodation.filter((x) => x.id === acc.id && x.isSubEntry);
          acc.additionalEntries = updatedEntries;
        }
      });

      localStorage.setItem('New Quote Accomodation', JSON.stringify({
        selectedAccomodationsRoomTypes,
        selectedAccomodationsMealPlans,
        selectedAccomodationsNights,
        selectedAccomodationsPax,
        selectedAccomodations: temp2Accomodation,
      }));
      history.replace('/quote/quotations/create/costing');
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
        acc.pax = '';
      });

      const tempPresetAccs = [...presetSelectedAccs];
      presetSelectedAccs.forEach((acc: any) => {
        const numberOfEntries = pax > 3 ? Math.ceil(pax / 3) : Number(customerDetails[19]);
        acc.isMultiple = true;
        const additionalEntry = { ...acc, isSubEntry: true };
        acc.additionalEntries = [];

        for (let i = 0; i < numberOfEntries - 1; i += 1) {
          const addAtIndex = tempPresetAccs.findIndex((x) => x.id === acc.id);
          acc.additionalEntries.push(additionalEntry);
          tempPresetAccs.splice(addAtIndex + 1, 0, additionalEntry);
        }
      });

      return tempPresetAccs;
    }

    presetSelectedAccs.forEach((acc: any) => {
      // eslint-disable-next-line no-nested-ternary
      acc.pax = pax === 1 ? 'Single' : pax === 2 ? 'Double' : 'Triple';
    });

    return presetSelectedAccs;
  };

  const addPresetQuote = (quote: any) => {
    const setAccomodations = setPresetPax(quote.selectedAccomodations);
    setSelectedAccomodations(setAccomodations);
    setSelectedAccomodationsMealPlans(quote.selectedAccomodationsMealPlans);
    setSelectedAccomodationsRoomTypes(quote.selectedAccomodationsRoomTypes);
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
          onClick={() => history.replace('/quote/quotations/create/customer')}
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
                      onClick={() => addPresetQuote(quote)}
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
                  'CITY',
                  'NIGHTS',
                  'CATEGORY',
                  'ACCOMODATION',
                  'PAX',
                  'ROOM TYPE',
                  'MEAL PLAN',
                  '',
                ]}
                selectedAccomodations={selectedAccomodations}
                selectedAccomodationsNights={selectedAccomodationsNights}
                selectedAccomodationsRoomTypes={selectedAccomodationsRoomTypes}
                selectedAccomodationsMealPlans={selectedAccomodationsMealPlans}
                selectedAccomodationsPax={selectedAccomodationsPax}
                setSelectedAccomodationsNights={setSelectedAccomodationsNights}
                setSelectedAccomodationsRoomTypes={setSelectedAccomodationsRoomTypes}
                setSelectedAccomodationsMealPlans={setSelectedAccomodationsMealPlans}
                setSelectedAccomodationsPax={setSelectedAccomodationsPax}
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
                      ${Array.from(new Set(showNoRateErrorMessage.map((rtErr: any) => Object.keys(rtErr)))).join(', ')}
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
