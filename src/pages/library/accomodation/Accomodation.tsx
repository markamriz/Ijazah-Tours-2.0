import { useEffect, useState } from 'react';

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
} from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { Route, useHistory } from 'react-router-dom';

import DivAtom from '../../../atoms/DivAtom';
import { db } from '../../../firebase';
import AccomodationTable from '../../../organisms/library/accomodation/AccomodationTable';
import { selectWithNavbarHeight } from '../../../redux/containerSizeSlice';
import { libraryStyles } from '../../../styles';
import { searchData } from '../../../utils/helpers';
import {
  LocationDropdown,
  CityDropdown,
  DropdownOption,
  LibraryAccomodation,
  SettingsLocation,
  SettingsRoomProperties,
} from '../../../utils/types';
import CreateAccomodation from './CreateAccomodation';
import EditAccomodation from './EditAccomodation';

function Accomodation() {
  const height = useSelector(selectWithNavbarHeight);

  const [accomodationLocations, setAccomodationLocations] = useState<LocationDropdown[]>([]);
  const [accomodationCities, setAccomodationCities] = useState<CityDropdown[]>([]);
  const [
    accomodationFilteredCities,
    setAccomodationFilteredCities,
  ] = useState<CityDropdown[]>([]);

  const [accomodationData, setAccomodationData] = useState<LibraryAccomodation[]>([]);
  const [roomViewData, setRoomViewData] = useState<SettingsRoomProperties[]>([]);
  const [roomCategoriesData, setRoomCategoriesData] = useState<SettingsRoomProperties[]>([]);
  const [roomGradingsData, setRoomGradingsData] = useState<SettingsRoomProperties[]>([]);
  const [accomodationTypeData, setAccomodationTypeData] = useState<DropdownOption[]>([]);
  const [
    initialAccomodationSearchData,
    setInitialAccomodationSearchData,
  ] = useState<LibraryAccomodation[]>([]);

  const [search, setSearch] = useState('');

  const [editAccomodationData, setEditAccomodationData] = useState<LibraryAccomodation>();
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const history = useHistory();

  useEffect(() => {
    searchData(search, initialAccomodationSearchData, setAccomodationData);
  }, [initialAccomodationSearchData, search]);

  useEffect(() => {
    const getIntialAccomodationData = async () => {
      const data = (await getDocs(collection(db, 'Library Accomodation'))).docs;
      const accomodations = data.map((dc) => dc.data());
      const ids = data.map((dc) => dc.id);
      ids.forEach((id, i) => {
        accomodations[i].id = id;
      });

      setAccomodationData(accomodations as LibraryAccomodation[]);
      setInitialAccomodationSearchData(accomodations as LibraryAccomodation[]);
    };

    getIntialAccomodationData();
  }, [isDeleting, isCreating, isUpdating]);

  useEffect(() => {
    const getIntialRoomData = async () => {
      const lData = (await getDocs(collection(db, 'Settings Locations'))).docs;
      const vData = (await getDocs(collection(db, 'Settings Room Views'))).docs;
      const tData = (await getDocs(collection(db, 'Settings Room Types'))).docs;
      const gData = (await getDocs(collection(db, 'Settings Room Gradings'))).docs;
      const aData = (await getDocs(collection(db, 'Settings Accomodation Types'))).docs;
      const locs = lData.map((dc) => dc.data());
      const views = vData.map((dc) => dc.data());
      const types = tData.map((dc) => dc.data());
      const gradings = gData.map((dc) => dc.data());
      const accomodationTypes = aData.map((dc) => dc.data());

      const locIds = lData.map((dc) => dc.id);
      const viewIds = vData.map((dc) => dc.id);
      const typeIds = tData.map((dc) => dc.id);
      const gradingIds = gData.map((dc) => dc.id);
      const accomodationTypeIds = aData.map((dc) => dc.id);

      locIds.forEach((id, i) => {
        locs[i].id = id;
      });
      viewIds.forEach((id, i) => {
        views[i].id = id;
      });
      typeIds.forEach((id, i) => {
        types[i].id = id;
      });
      gradingIds.forEach((id, i) => {
        gradings[i].id = id;
      });
      accomodationTypeIds.forEach((id, i) => {
        accomodationTypes[i].id = id;
      });

      setAccomodationLocations((locs as SettingsLocation[]).map((l) => l.location));
      setAccomodationCities((locs as SettingsLocation[]).map((l) => l.cities).flat());
      setRoomGradingsData(gradings as SettingsRoomProperties[]);
      setRoomViewData(views as SettingsRoomProperties[]);
      setRoomCategoriesData(types as SettingsRoomProperties[]);
      setAccomodationTypeData(accomodationTypes.map((acc) => ({
        value: acc.val,
        label: acc.val,
      })));
    };

    getIntialRoomData();
  }, []);

  const deleteAccomodation = async (row: LibraryAccomodation) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this accomodation?');
    if (confirmDelete) {
      setIsDeleting(false);
      await deleteDoc(doc(db, 'Library Accomodation', row.id));
      setIsDeleting(true);
    }
  };

  const onEditAccomodationClick = (row: LibraryAccomodation) => {
    setEditAccomodationData(row);
    history.replace(`/library/accomodation/edit/${row.id}`);
  };

  return (
    <DivAtom style={libraryStyles.container}>
      <DivAtom
        style={{
          ...libraryStyles.innerContainer,
          height: `${height}px`,
        }}
      >
        <Route path="/library/accomodation/create">
          <CreateAccomodation
            roomViewData={roomViewData}
            roomCategoriesData={roomCategoriesData}
            roomGradingsData={roomGradingsData}
            isCreating={isCreating}
            setIsCreating={setIsCreating}
          />
        </Route>
        <Route path="/library/accomodation/edit/:id">
          <EditAccomodation
            accomodationTypeData={accomodationTypeData}
            accomodationLocations={accomodationLocations}
            accomodationCities={accomodationCities}
            accomodationFilteredCities={accomodationFilteredCities}
            setAccomodationFilteredCities={setAccomodationFilteredCities}
            roomViewData={roomViewData}
            roomCategoriesData={roomCategoriesData}
            roomGradingsData={roomGradingsData}
            isUpdating={isUpdating}
            setIsUpdating={setIsUpdating}
            row={editAccomodationData!}
          />
        </Route>
        <Route exact path="/library/accomodation">
          <DivAtom>
            <AccomodationTable
              search={search}
              setSearch={setSearch}
              deleteAccomodation={deleteAccomodation}
              onEditAccomodationClick={onEditAccomodationClick}
              data={accomodationData}
            />
          </DivAtom>
        </Route>
      </DivAtom>
    </DivAtom>
  );
}

export default Accomodation;
