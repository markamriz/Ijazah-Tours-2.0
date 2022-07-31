import {
  MouseEvent,
  useEffect,
  useState,
} from 'react';

import { CircularProgress } from '@material-ui/core';
import ChevronLeftRoundedIcon from '@material-ui/icons/ChevronLeftRounded';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
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
  LocationDropdown,
  CityDropdown,
  DropdownOption,
  LibraryAccomodation,
  SettingsRoomProperties,
} from '../../../utils/types';

interface EditAccomodationProps {
  accomodationData: LibraryAccomodation[];
  row: LibraryAccomodation;
  isUpdating: boolean;
  accomodationTypeData: DropdownOption[],
  accomodationLocations: LocationDropdown[];
  accomodationCities: CityDropdown[];
  accomodationFilteredCities: CityDropdown[];
  roomViewData: SettingsRoomProperties[];
  roomCategoriesData: SettingsRoomProperties[];
  roomGradingsData: SettingsRoomProperties[];
  setIsUpdating: any;
  setAccomodationFilteredCities: any;
}

function EditAccomodation({
  accomodationData,
  row,
  isUpdating,
  accomodationTypeData,
  accomodationCities,
  accomodationFilteredCities,
  accomodationLocations,
  roomViewData,
  roomCategoriesData,
  roomGradingsData,
  setIsUpdating,
  setAccomodationFilteredCities,
}: EditAccomodationProps) {
  const width = useSelector(selectWithNavbarWidth);

  // Have a duplicate to determine if same name or not to prevent duplicate hotels
  const [prevName] = useState(row.name);
  const [name, setName] = useState(row.name);
  const [group, setGroup] = useState(row.group);
  const [accomodationType, setAccomodationType] = useState(row.accomodationType);
  const [location, setLocation] = useState(row.country);
  const [city, setCity] = useState(row.city);
  const [contactNumber, setContactNumber] = useState(row.tel);
  const [email, setEmail] = useState(row.email);
  const [webLink, setWebLink] = useState(row.webLink);
  const [ijazahLink, setIjazahLink] = useState(row.ijazahLink);

  const [roomCategories, setRoomCategories] = useState(
    roomCategoriesData.map((category) => (
      !!row.categoryValues[category.val] || !!row.rates.find((r) => r.newRateType === category.val)
    )),
  );
  const [roomViews, setRoomViews] = useState(
    row.views.map((val) => val.checked || false),
  );
  const [roomGradings, setRoomGradings] = useState(
    row.gradings.map((val) => val.checked || false),
  );

  const [additionalBedPrice, setAdditionalBedPrice] = useState(row.additionalBedPrice);

  const [selectedTypes, setSelectedTypes] = useState(Object.keys(row.categoryValues));

  const [selectedTypeValues, setSelectedTypeValues] = useState(row.categoryValues);

  const [rateData, setRateData] = useState<AccomodationRate[]>(row.rates);
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
    const locationId = accomodationLocations.find((l) => l.value === row.country)?.id;
    const cities = accomodationCities.filter((c) => c.countryId === locationId);
    setAccomodationFilteredCities(cities);
  }, []);

  const onEditAccomodation = async () => {
    setShowValidationErrorMessage(false);
    setShowExistingErrorMessage(false);
    if (name.trim() === '' || location.trim() === ''
      || city.trim() === '' || contactNumber.trim() === '' || email.trim() === ''
      || additionalBedPrice.trim() === '' || rateData.length === 0) {
      setShowValidationErrorMessage(true);
      return;
    }

    if ((prevName !== name)
      && (accomodationData.find((a) => a.name.toLowerCase() === name.toLowerCase()))) {
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

    setIsUpdating(true);
    await updateDoc(doc(db, 'Library Accomodation', row.id), {
      name,
      group,
      city,
      email,
      webLink,
      ijazahLink,
      additionalBedPrice,
      views,
      gradings,
      country: location,
      categories: roomCategories,
      categoryValues: selectedTypeValues,
      tel: contactNumber,
      rates: rateData,
      updatedAt: serverTimestamp(),
    });

    setIsUpdating(false);
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

  const deleteRate = (rw: AccomodationRate) => {
    const updatedRateData = [...rateData];
    updatedRateData.splice(rateData.findIndex((val) => val.id === rw.id), 1);
    setRateData(updatedRateData);
  };

  const clearRateInputs = () => {
    setNewMealPlan('');
    setNewSinglePrice('');
    setNewDoublePrice('');
    setNewTriplePrice('');
  };

  const addRoomGradings = (i: number) => {
    const updatedGradings = roomGradings.map((lang, index) => (index === i ? !lang : lang));
    setRoomGradings(updatedGradings);
  };

  const addRoomView = (i: number) => {
    const updatedViews = roomViews.map((lang, index) => (index === i ? !lang : lang));
    setRoomViews(updatedViews);
  };

  const addRoomCategory = (i: number) => {
    const updatedCategories = roomCategories.map((lang, index) => (index === i ? !lang : lang));
    setRoomCategories(updatedCategories);

    const updatedSelectedTypes = roomCategoriesData.filter((label, index: number) => (
      updatedCategories[index] && label.val
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
          text="Edit Accomodation"
        />
      </DivAtom>

      {(accomodationTypeData
        && roomCategoriesData
        && roomViewData
        && roomGradingsData
        && accomodationLocations
        && accomodationFilteredCities.length > 0
      ) ? (
          <CreateEditAccomodationForm
            isCreating={isUpdating}
            accomodationTypeData={accomodationTypeData}
            rateRoomTypes={roomCategoriesData.map((type) => ({ label: type.val, value: type.val }))}
            accomodationLocations={accomodationLocations}
            accomodationCities={accomodationCities}
            accomodationFilteredCities={accomodationFilteredCities}
            setAccomodationFilteredCities={setAccomodationFilteredCities}
            allRoomTypes={roomCategoriesData}
            allRoomViews={roomViewData}
            allRoomGradings={roomGradingsData}
            deleteRate={deleteRate}
            rateData={rateData}
            width={width}
            btnText="Update"
            showValidationErrorMessage={showValidationErrorMessage}
            showExistingErrorMessage={showExistingErrorMessage}
            location={location}
            accomodationType={accomodationType}
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
            onAddEditAccomodation={onEditAccomodation}
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

export default EditAccomodation;
