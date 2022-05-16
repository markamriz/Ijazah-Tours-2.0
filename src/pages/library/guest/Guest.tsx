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
import GuestTable from '../../../organisms/library/guest/GuestTable';
import { selectWithNavbarHeight } from '../../../redux/containerSizeSlice';
import { libraryStyles } from '../../../styles';
import { searchData } from '../../../utils/helpers';
import { LibraryGuest } from '../../../utils/types';
import CreateGuest from './CreateGuest';
import EditGuest from './EditGuest';

function Guest() {
  const height = useSelector(selectWithNavbarHeight);
  const [guestData, setGuestData] = useState<LibraryGuest[]>([]);
  const [initialGuestSearchData, setInitialGuestSearchData] = useState<LibraryGuest[]>([]);
  const [search, setSearch] = useState('');

  const [editGuestData, setEditGuestData] = useState<LibraryGuest>();
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const history = useHistory();

  useEffect(() => {
    searchData(search, initialGuestSearchData, setGuestData);
  }, [initialGuestSearchData, search]);

  useEffect(() => {
    const getIntialData = async () => {
      const data = (await getDocs(collection(db, 'Library Guests'))).docs;
      const guests = data.map((dc) => dc.data());
      const ids = data.map((dc) => dc.id);
      ids.forEach((id, i) => {
        guests[i].id = id;
      });

      setGuestData(guests as LibraryGuest[]);
      setInitialGuestSearchData(guests as LibraryGuest[]);
    };

    getIntialData();
  }, [isDeleting, isCreating, isUpdating]);

  const deleteGuest = async (row: LibraryGuest) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this guest?');
    if (confirmDelete) {
      setIsDeleting(false);
      await deleteDoc(doc(db, 'Library Guests', row.id));
      setIsDeleting(true);
    }
  };

  const onEditGuestClick = (row: LibraryGuest) => {
    setEditGuestData(row);
    history.replace(`/library/guest/edit/${row.id}`);
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
          <Route path="/library/guest/create">
            <CreateGuest isCreating={isCreating} setIsCreating={setIsCreating} />
          </Route>
          <Route path="/library/guest/edit/:id">
            <EditGuest
              isUpdating={isUpdating}
              setIsUpdating={setIsUpdating}
              row={editGuestData!}
            />
          </Route>
          <Route exact path="/library/guest">
            <GuestTable
              search={search}
              setSearch={setSearch}
              onEditGuestClick={onEditGuestClick}
              deleteGuest={deleteGuest}
              data={guestData}
            />
          </Route>
        </DivAtom>
      </DivAtom>
    </DivAtom>
  );
}

export default Guest;
