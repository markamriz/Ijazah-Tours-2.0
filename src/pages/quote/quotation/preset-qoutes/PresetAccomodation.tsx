import {
  ChangeEvent,
  useEffect,
  useState,
} from 'react';

import { CircularProgress } from '@material-ui/core';
import ChevronLeftRoundedIcon from '@material-ui/icons/ChevronLeftRounded';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

import ButtonAtom from '../../../../atoms/ButtonAtom';
import DivAtom from '../../../../atoms/DivAtom';
import H2Atom from '../../../../atoms/H2Atom';
import IconAtom from '../../../../atoms/IconAtom';
import InputAtom from '../../../../atoms/InputAtom';
import { db } from '../../../../firebase';
import AccomodationTable from '../../../../organisms/quote/quotation/create-quotation/accomodation/AccomodationTable';
import Searchbar from '../../../../organisms/quote/quotation/create-quotation/accomodation/search-bar/Searchbar';
import { selectWith2NavbarHeight, selectWith2NavbarWidth } from '../../../../redux/containerSizeSlice';
import {
  fetchingDataIndicatorStyles,
  quoteCreateQuoteStyles,
} from '../../../../styles';
import { widthHeightDynamicStyle } from '../../../../utils/helpers';
import {
  SettingsSingleInput,
  UserAccomodation,
} from '../../../../utils/types';

function PresetAccomodation() {
  const height = useSelector(selectWith2NavbarHeight);
  const width = useSelector(selectWith2NavbarWidth);

  const [accomodationData, setAccomodationData] = useState<UserAccomodation[]>();
  const [selectedAccomodations, setSelectedAccomodations] = useState<UserAccomodation[]>([]);

  const [accomodationTypesData, setAccomodationTypesData] = useState<SettingsSingleInput[]>();
  const [roomTypesData, setRoomTypesData] = useState<SettingsSingleInput[]>();
  const [roomViewsData, setRoomViewsData] = useState<SettingsSingleInput[]>();
  const [roomGradingsData, setRoomGradingsData] = useState<SettingsSingleInput[]>();

  const [
    selectedAccomodationsRoomTypes,
    setSelectedAccomodationsRoomTypes,
  ] = useState<string[]>([]);

  const [
    selectedAccomodationsMealPlans,
    setSelectedAccomodationsMealPlans,
  ] = useState<string[]>([]);

  const [
    selectedAccomodationsRoomViews,
    setSelectedAccomodationsRoomViews,
  ] = useState<string[]>([]);

  const [
    selectedAccomodationsAdditionalBed,
    setSelectedAccomodationsAdditionalBed,
  ] = useState<string[]>([]);

  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const [savingPresetQuote, setSavingPresetQuote] = useState(false);

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
        ).selectedAccomodations as UserAccomodation[];

        setSelectedAccomodations(selectedAcc);
      }

      setAccomodationData(accData as UserAccomodation[]);
      setAccomodationTypesData(accTypesData as SettingsSingleInput[]);
      setRoomTypesData(rTypesData as SettingsSingleInput[]);
      setRoomViewsData(viewsData as SettingsSingleInput[]);
      setRoomGradingsData(gradingsData as SettingsSingleInput[]);
    };

    getInitialData();
  }, []);

  const addAccomodation = (acc: UserAccomodation) => {
    if (selectedAccomodations.find((a) => a.name === acc.name)) {
      return;
    }

    const roomTypes = Object.keys(acc.categoryValues)
      .map((cat) => ({ value: cat, label: cat }));

    const roomTypeOptions = acc.rates
      .map((rate) => rate.newRatePrice)
      .map((rate) => ({ value: rate, label: rate }));

    const roomViewOptions = acc.views.filter((view) => view.checked).map((view) => (
      { value: view.val, label: view.val }
    ));

    const mealPlanOptions = acc.rates
      .map((rate) => rate.newMealPlan)
      .map((rate) => ({ value: rate, label: rate }));

    acc.nights = '1';
    acc.roomRate = '';
    acc.total = '';
    acc.includeAdditionalBed = 'No';

    acc.roomType = roomTypes[0]?.value || roomTypeOptions[0].value;
    acc.mealPlan = mealPlanOptions[0].value;
    acc.roomView = roomViewOptions[0].value;

    const tempAccomodation = [...selectedAccomodations];
    tempAccomodation.push(acc);
    setSelectedAccomodations(tempAccomodation);
  };

  const savePresetQuote = async () => {
    const { title } = JSON.parse(
      localStorage.getItem('New Preset Quote')!,
    );

    setSavingPresetQuote(true);
    const tempAccomodation = [...selectedAccomodations];
    tempAccomodation.forEach((acc, index) => {
      acc.nights = '0';
      acc.includeAdditionalBed = selectedAccomodationsAdditionalBed[index] || 'No';
      acc.roomType = selectedAccomodationsRoomTypes[index] || '';
      acc.mealPlan = selectedAccomodationsMealPlans[index] || '';
      acc.pax = '';
    });

    await setDoc(doc(db, 'Preset Quotes', uuid()), {
      title,
      selectedAccomodationsMealPlans,
      selectedAccomodationsRoomTypes,
      selectedAccomodationsRoomViews,
      selectedAccomodationsAdditionalBed,
      selectedAccomodations: tempAccomodation,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    setSavingPresetQuote(false);
    localStorage.removeItem('New Preset Quote');
    history.replace('/quote/quotations');
  };

  const deleteAccomodation = (acc: UserAccomodation) => {
    const removeIndexes = selectedAccomodations.map((ac, i) => (ac.id === acc.id ? i : ''))
      .filter(String) as number[];

    const tempAccomodationRoomTypes = [...selectedAccomodationsRoomTypes];
    const tempAccomodationMealPlans = [...selectedAccomodationsMealPlans];
    const tempAccomodationRoomViews = [...selectedAccomodationsRoomViews];
    const tempAccomodationAdditionalBed = [...selectedAccomodationsAdditionalBed];
    const tempAccomodation = [...selectedAccomodations];

    tempAccomodationRoomTypes.splice(removeIndexes[0], removeIndexes.length);
    tempAccomodationMealPlans.splice(removeIndexes[0], removeIndexes.length);
    tempAccomodationRoomViews.splice(removeIndexes[0], removeIndexes.length);
    tempAccomodationAdditionalBed.splice(removeIndexes[0], removeIndexes.length);
    tempAccomodation.splice(removeIndexes[0], removeIndexes.length);

    setSelectedAccomodationsRoomTypes(tempAccomodationRoomTypes);
    setSelectedAccomodationsRoomViews(tempAccomodationRoomViews);
    setSelectedAccomodationsAdditionalBed(tempAccomodationAdditionalBed);
    setSelectedAccomodationsMealPlans(tempAccomodationMealPlans);
    setSelectedAccomodations(tempAccomodation);
  };

  const shiftAccomodationPosition = (acc: UserAccomodation, direction: string) => {
    const accPositions = selectedAccomodations.map((ac, i) => (ac.id === acc.id ? i : ''))
      .filter(String) as number[];

    if ((accPositions.includes(0) && direction === 'up')
    || (accPositions.includes(selectedAccomodations.length - 1) && direction === 'down')) {
      // Last acc cannot move down; first acc cannot move up
      return;
    }

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

    const numberOfEntries = Number(customerDetails[19]) < Math.ceil(pax / 3)
      ? Math.ceil(pax / 3) : Number(customerDetails[19]);

    const newPositions = accPositions.map((pos) => (direction === 'up' ? pos - numberOfEntries : pos + numberOfEntries));

    const tempAccomodationRoomTypes = [...selectedAccomodationsRoomTypes];
    const tempAccomodationRoomViews = [...selectedAccomodationsRoomViews];
    const tempAccomodationMealPlans = [...selectedAccomodationsMealPlans];
    const tempAccomodationAdditionalBed = [...selectedAccomodationsAdditionalBed];
    const tempAccomodation = [...selectedAccomodations];

    const removedAccAddBed = tempAccomodationAdditionalBed
      .splice(accPositions[0], accPositions.length);
    const removedAccRoomType = tempAccomodationRoomTypes
      .splice(accPositions[0], accPositions.length);
    const removedAccRoomView = tempAccomodationRoomViews
      .splice(accPositions[0], accPositions.length);
    const removedAccMealPlan = tempAccomodationMealPlans
      .splice(accPositions[0], accPositions.length);
    const removedAcc = tempAccomodation
      .splice(accPositions[0], accPositions.length);

    newPositions.forEach((pos, i) => {
      tempAccomodationRoomTypes.splice(pos, 0, removedAccRoomType[i]);
      tempAccomodationRoomViews.splice(pos, 0, removedAccRoomView[i]);
      tempAccomodationMealPlans.splice(pos, 0, removedAccMealPlan[i]);
      tempAccomodationAdditionalBed.splice(pos, 0, removedAccAddBed[i]);
      tempAccomodation.splice(pos, 0, removedAcc[i]);
    });

    setSelectedAccomodationsRoomTypes(tempAccomodationRoomTypes);
    setSelectedAccomodationsRoomViews(tempAccomodationRoomViews);
    setSelectedAccomodationsAdditionalBed(tempAccomodationAdditionalBed);
    setSelectedAccomodationsMealPlans(tempAccomodationMealPlans);
    setSelectedAccomodations(tempAccomodation);
  };

  return (
    <DivAtom style={{ height: `${height}px` }}>
      <DivAtom style={quoteCreateQuoteStyles.header}>
        <IconAtom
          size="small"
          children={<ChevronLeftRoundedIcon />}
          style={quoteCreateQuoteStyles.backBtn}
          onClick={() => history.replace('/quote/quotations/create/preset/holiday')}
        />
        <H2Atom style={quoteCreateQuoteStyles.title} text="Accomodation" />
      </DivAtom>

      {(accomodationData && accomodationTypesData
        && roomTypesData && roomViewsData && roomGradingsData) ? (
          <>
            <DivAtom style={quoteCreateQuoteStyles.tableContainer}>
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
                  'CATEGORY',
                  'ACCOMODATION',
                  'EXTRA BED',
                  'ROOM TYPE',
                  'ROOM VIEW',
                  'MEAL PLAN',
                  '',
                ]}
                selectedAccomodations={selectedAccomodations}
                selectedAccomodationsRoomTypes={selectedAccomodationsRoomTypes}
                selectedAccomodationsRoomViews={selectedAccomodationsRoomViews}
                selectedAccomodationsMealPlans={selectedAccomodationsMealPlans}
                selectedAccomodationsAdditionalBed={selectedAccomodationsAdditionalBed}
                setSelectedAccomodationsRoomTypes={setSelectedAccomodationsRoomTypes}
                setSelectedAccomodationsRoomViews={setSelectedAccomodationsRoomViews}
                setSelectedAccomodationsMealPlans={setSelectedAccomodationsMealPlans}
                setSelectedAccomodationsAdditionalBed={setSelectedAccomodationsAdditionalBed}
                deleteAccomodation={deleteAccomodation}
                shiftAccomodationPosition={shiftAccomodationPosition}
                preset
              />
            </DivAtom>

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
                text="Save"
                endIcon={savingPresetQuote && <CircularProgress size={20} color="inherit" />}
                disabled={accomodationData.length === 0 || savingPresetQuote}
                onClick={savePresetQuote}
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

export default PresetAccomodation;
