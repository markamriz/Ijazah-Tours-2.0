import { useEffect, useState } from 'react';

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
} from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { Route, useHistory } from 'react-router-dom';

import CreateDriver from './CreateDriver';
import EditDriver from './EditDriver';
import DivAtom from '../../../atoms/DivAtom';
import { db } from '../../../firebase';
import DriverTable from '../../../organisms/library/driver/DriverTable';
import { selectWithNavbarHeight } from '../../../redux/containerSizeSlice';
import { libraryStyles } from '../../../styles';
import { searchData } from '../../../utils/helpers';
import { LibraryDriver } from '../../../utils/types';

function Driver() {
  const height = useSelector(selectWithNavbarHeight);

  const [driverData, setDriverData] = useState<LibraryDriver[]>([]);
  const [initialDriverSearchData, setInitialDriverSearchData] = useState<LibraryDriver[]>([]);
  const [search, setSearch] = useState('');

  const [editDriverData, setEditDriverData] = useState<LibraryDriver>();
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const history = useHistory();

  useEffect(() => {
    searchData(search, initialDriverSearchData, setDriverData);
  }, [initialDriverSearchData, search]);

  useEffect(() => {
    const getIntialData = async () => {
      const data = (await getDocs(collection(db, 'Library Drivers'))).docs;
      const drivers = data.map((dc) => dc.data());
      const ids = data.map((dc) => dc.id);
      ids.forEach((id, i) => {
        drivers[i].id = id;
      });

      setDriverData(drivers as LibraryDriver[]);
      setInitialDriverSearchData(drivers as LibraryDriver[]);
    };

    getIntialData();
  }, [isDeleting, isCreating, isUpdating]);

  const deleteDriver = async (row: LibraryDriver) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this driver?');
    if (confirmDelete) {
      setIsDeleting(false);
      await deleteDoc(doc(db, 'Library Drivers', row.id));
      setIsDeleting(true);
    }
  };

  const onEditDriverClick = (row: LibraryDriver) => {
    setEditDriverData(row);
    history.replace(`/library/driver/edit/${row.id}`);
  };

  return (
    <DivAtom style={libraryStyles.container}>
      <DivAtom
        style={{
          ...libraryStyles.innerContainer,
          height: `${height}px`,
        }}
      >
        <DivAtom>
          <Route path="/library/driver/create">
            <CreateDriver isCreating={isCreating} setIsCreating={setIsCreating} />
          </Route>
          <Route path="/library/driver/edit/:id">
            <EditDriver
              isUpdating={isUpdating}
              setIsUpdating={setIsUpdating}
              row={editDriverData!}
            />
          </Route>
          <Route exact path="/library/driver">
            <DriverTable
              search={search}
              setSearch={setSearch}
              onEditDriverClick={onEditDriverClick}
              deleteDriver={deleteDriver}
              data={driverData}
            />
          </Route>
        </DivAtom>
      </DivAtom>
    </DivAtom>
  );
}

export default Driver;
