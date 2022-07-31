import {
  MouseEvent,
  useEffect,
  useState,
} from 'react';

import { CircularProgress } from '@material-ui/core';
import ChevronLeftRoundedIcon from '@material-ui/icons/ChevronLeftRounded';
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

import DivAtom from '../../../atoms/DivAtom';
import H2Atom from '../../../atoms/H2Atom';
import IconAtom from '../../../atoms/IconAtom';
import { db } from '../../../firebase';
import CreateEditAccomodationForm from '../../../organisms/library/accomodation/CreateEditAccomodationForm';
import { selectWithNavbarWidth } from '../../../redux/containerSizeSlice';
import { fetchingDataIndicatorStyles, libraryAccomodationStyles } from '../../../styles';
import {
  AccomodationRate,
  SettingsRoomProperties,
  DropdownOption,
  SettingsLocation,
  LocationDropdown,
  CityDropdown,
  LibraryAccomodation,
} from '../../../utils/types';

interface CreateAccomodationProps {
  accomodationData: LibraryAccomodation[];
  isCreating: boolean;
  roomViewData: SettingsRoomProperties[];
  roomCategoriesData: SettingsRoomProperties[];
  roomGradingsData: SettingsRoomProperties[];
  setIsCreating: any;
}

function CreateAccomodation({
  accomodationData,
  isCreating,
  roomViewData,
  roomCategoriesData,
  roomGradingsData,
  setIsCreating,
}: CreateAccomodationProps) {
  const width = useSelector(selectWithNavbarWidth);

  const [accomodationLocations, setAccomodationLocations] = useState<LocationDropdown[]>();
  const [accomodationCities, setAccomodationCities] = useState<CityDropdown[]>();
  const [
    accomodationFilteredCities,
    setAccomodationFilteredCities,
  ] = useState<CityDropdown[]>([]);

  const [accomodationTypeData, setAccomodationTypeData] = useState<DropdownOption[]>();
  const [accomodationType, setAccomodationType] = useState('');
  const [name, setName] = useState('');
  const [group, setGroup] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [webLink, setWebLink] = useState('');
  const [ijazahLink, setIjazahLink] = useState('');

  const [roomCategories, setRoomCategories] = useState<boolean[]>(
    new Array(roomCategoriesData.length).fill(false),
  );
  const [roomViews, setRoomViews] = useState<boolean[]>(
    new Array(roomViewData.length).fill(false),
  );
  const [roomGradings, setRoomGradings] = useState<boolean[]>(
    new Array(roomGradingsData.length).fill(false),
  );

  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    new Array(roomCategoriesData.length).fill(undefined),
  );
  const [selectedTypeValues, setSelectedTypeValues] = useState<{ [k: string]: string; }>({});

  const [additionalBedPrice, setAdditionalBedPrice] = useState('');
  const [rateData, setRateData] = useState<AccomodationRate[]>([]);
  const [newRateType, setNewRateType] = useState('');
  const [newRateStart, setNewRateStart] = useState('');
  const [newRateEnd, setNewRateEnd] = useState('');
  const [newMealPlan, setNewMealPlan] = useState('');
  const [newSinglePrice, setNewSinglePrice] = useState('');
  const [newDoublePrice, setNewDoublePrice] = useState('');
  const [newTriplePrice, setNewTriplePrice] = useState('');

  const [showValidationErrorMessage, setShowValidationErrorMessage] = useState(false);
  const [showExistingErrorMessage, setShowExistingErrorMessage] = useState(false);

  const history = useHistory();

  useEffect(() => {
    const getInitialData = async () => {
      const aData = (await getDocs(collection(db, 'Settings Accomodation Types'))).docs;
      const lData = (await getDocs(collection(db, 'Settings Locations'))).docs;
      const accData = aData.map((dc) => dc.data());
      const locData = lData.map((dc) => dc.data());
      const accIds = aData.map((dc) => dc.id);
      const locIds = lData.map((dc) => dc.id);

      accIds.forEach((id, i) => {
        accData[i].id = id;
      });
      locIds.forEach((id, i) => {
        locData[i].id = id;
      });
      const types = accData.map((acc) => ({
        value: acc.val,
        label: acc.val,
      }));

      setAccomodationLocations((locData as SettingsLocation[]).map((l) => l.location));
      setAccomodationCities((locData as SettingsLocation[]).map((l) => l.cities).flat());
      setAccomodationTypeData(types);
      setAccomodationType(types[0].value);
    };

    getInitialData();
  }, []);

  const onAddAccomodation = async () => {
    setShowValidationErrorMessage(false);
    setShowExistingErrorMessage(false);
    if (name.trim() === '' || location.trim() === ''
      || city.trim() === '' || contactNumber.trim() === '' || email.trim() === ''
      || additionalBedPrice.trim() === '' || rateData.length === 0) {
      setShowValidationErrorMessage(true);
      return;
    }

    if (accomodationData.find((a) => a.name.toLowerCase() === name.toLowerCase())) {
      setShowExistingErrorMessage(true);
      return;
    }

    const views = [...roomViewData];
    views.forEach((v, i) => {
      v.checked = roomViews[i];
    });
    const gradings = [...roomGradingsData];
    gradings.forEach((v, i) => {
      v.checked = roomGradings[i];
    });

    setIsCreating(true);
    await setDoc(doc(db, 'Library Accomodation', uuid()), {
      name,
      group,
      city,
      email,
      webLink,
      ijazahLink,
      additionalBedPrice,
      views,
      gradings,
      accomodationType,
      country: location,
      categories: roomCategories,
      categoryValues: selectedTypeValues,
      tel: contactNumber,
      rates: rateData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    setIsCreating(false);
    clearInputs();
    history.replace('/library/accomodation');
  };

  const onCreateRate = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    event.preventDefault();
    setRateData([
      ...rateData,
      {
        id: uuid(),
        newRateType,
        newRateStart,
        newRateEnd,
        newMealPlan,
        newRatePrice: `$${newSinglePrice}`,
        newSinglePrice: `$${newSinglePrice}`,
        newDoublePrice: `$${newDoublePrice}`,
        newTriplePrice: `$${newTriplePrice}`,
      },
    ]);

    clearRateInputs();
  };

  const deleteRate = (row: AccomodationRate) => {
    const updatedRateData = [...rateData];
    updatedRateData.splice(rateData.findIndex((val) => val.id === row.id), 1);
    setRateData(updatedRateData);
  };

  const clearRateInputs = () => {
    setNewMealPlan('');
    setNewSinglePrice('');
    setNewDoublePrice('');
    setNewTriplePrice('');
  };

  const clearInputs = () => {
    setName('');
    setGroup('');
    setLocation('');
    setCity('');
    setAdditionalBedPrice('');
    setContactNumber('');
    setEmail('');
    setWebLink('');
    setIjazahLink('');
    clearRateInputs();
  };

  const addRoomGradings = (i: number) => {
    const updatedGradings = roomGradings.map((val, index) => (index === i ? !val : val));
    setRoomGradings(updatedGradings);
  };

  const addRoomView = (i: number) => {
    const updatedViews = roomViews.map((val, index) => (index === i ? !val : val));
    setRoomViews(updatedViews);
  };

  const addRoomCategory = (i: number) => {
    const updatedCategories = roomCategories.map((val, index) => (index === i ? !val : val));
    setRoomCategories(updatedCategories);

    const updatedSelectedTypes = roomCategoriesData.filter(({ val }, index: number) => (
      updatedCategories[index] && val
    ));

    setSelectedTypes(updatedSelectedTypes.map((type) => type.val));
  };

  const onSetSelectedTypeValue = (type: string, val: string) => {
    const updatedSelectedTypeValues = { ...selectedTypeValues, [type]: val };
    setSelectedTypeValues(updatedSelectedTypeValues);
  };

  return (
    <DivAtom>
      <DivAtom style={libraryAccomodationStyles.header}>
        <IconAtom
          size="small"
          children={<ChevronLeftRoundedIcon />}
          style={libraryAccomodationStyles.backBtn}
          onClick={() => history.replace('/library/accomodation')}
        />
        <H2Atom
          style={libraryAccomodationStyles.title}
          text="Create Accomodation"
        />
      </DivAtom>

      {(accomodationTypeData
        && roomCategoriesData
        && roomViewData
        && roomGradingsData
        && accomodationLocations
        && accomodationCities
      ) ? (
          <CreateEditAccomodationForm
            rateData={rateData}
            accomodationTypeData={accomodationTypeData}
            rateRoomTypes={roomCategoriesData.map((type) => ({ label: type.val, value: type.val }))}
            accomodationLocations={accomodationLocations}
            accomodationCities={accomodationCities}
            accomodationFilteredCities={accomodationFilteredCities}
            setAccomodationFilteredCities={setAccomodationFilteredCities}
            allRoomTypes={roomCategoriesData}
            allRoomViews={roomViewData}
            allRoomGradings={roomGradingsData}
            isCreating={isCreating}
            deleteRate={(row: AccomodationRate) => deleteRate(row)}
            showValidationErrorMessage={showValidationErrorMessage}
            showExistingErrorMessage={showExistingErrorMessage}
            width={width}
            btnText="Create"
            accomodationType={accomodationType}
            location={location}
            city={city}
            group={group}
            name={name}
            contactNumber={contactNumber}
            email={email}
            webLink={webLink}
            ijazahLink={ijazahLink}
            additionalBedPrice={additionalBedPrice}
            newRateType={newRateType}
            newRateStart={newRateStart}
            newRateEnd={newRateEnd}
            newMealPlan={newMealPlan}
            newSinglePrice={newSinglePrice}
            newDoublePrice={newDoublePrice}
            newTriplePrice={newTriplePrice}
            selectedTypes={selectedTypes}
            roomCategories={roomCategories}
            roomViews={roomViews}
            roomGradings={roomGradings}
            selectedTypeValues={selectedTypeValues}
            addRoomCategory={addRoomCategory}
            addRoomView={addRoomView}
            addRoomGradings={addRoomGradings}
            onSetSelectedTypeValue={onSetSelectedTypeValue}
            onCreateRate={onCreateRate}
            onAddEditAccomodation={onAddAccomodation}
            setAccomodationType={setAccomodationType}
            setLocation={setLocation}
            setCity={setCity}
            setGroup={setGroup}
            setName={setName}
            setContactNumber={setContactNumber}
            setEmail={setEmail}
            setWebLink={setWebLink}
            setIjazahLink={setIjazahLink}
            setAdditionalBedPrice={setAdditionalBedPrice}
            setNewRateType={setNewRateType}
            setNewRateStart={setNewRateStart}
            setNewRateEnd={setNewRateEnd}
            setNewMealPlan={setNewMealPlan}
            setNewSinglePrice={setNewSinglePrice}
            setNewDoublePrice={setNewDoublePrice}
            setNewTriplePrice={setNewTriplePrice}
          />
        ) : (
          <DivAtom style={fetchingDataIndicatorStyles.container}>
            <CircularProgress size={20} color="primary" />
          </DivAtom>
        )}
    </DivAtom>
  );
}

export default CreateAccomodation;
