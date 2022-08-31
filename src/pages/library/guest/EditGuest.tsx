import { useState } from 'react';

import ChevronLeftRoundedIcon from '@material-ui/icons/ChevronLeftRounded';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import DivAtom from '../../../atoms/DivAtom';
import H2Atom from '../../../atoms/H2Atom';
import IconAtom from '../../../atoms/IconAtom';
import { db } from '../../../firebase';
import CreateEditGuestForm from '../../../organisms/library/guest/CreateEditGuestForm';
import { selectWithNavbarWidth } from '../../../redux/containerSizeSlice';
import { libraryCreateGuestStyles } from '../../../styles';
import { uploadImage } from '../../../utils/helpers';
import { LibraryGuest } from '../../../utils/types';

const storage = getStorage();

interface EditGuestProps {
  row: LibraryGuest;
  isUpdating: boolean;
  setIsUpdating: any;
}

function EditGuest({ row, isUpdating, setIsUpdating }: EditGuestProps) {
  const width = useSelector(selectWithNavbarWidth);

  const [refNum, setRefNum] = useState(row.refNum);
  const [firstName, setFirstName] = useState(row.name.split(' ')[0]);
  const [lastName, setLastName] = useState(row.name.split(' ')[1]);
  const [country, setCountry] = useState(row.country);
  const [city, setCity] = useState(row.city);
  const [contactNumber, setContactNumber] = useState(row.tel);
  const [email, setEmail] = useState(row.email);
  const [occupation, setOccupation] = useState(row.occupation);
  const [adults, setAdults] = useState(row.adults);
  const [childAge, setChildAge] = useState(0);
  const [status, setStatus] = useState(row.status);
  const [childrenAges, setChildrenAges] = useState<number[]>(row.childrenAges);
  const [rooms, setRooms] = useState(row.rooms);
  const [passport, setPassport] = useState<any[]>([row.passport]);

  const [showValidationErrorMessage, setShowValidationErrorMessage] = useState(false);

  const history = useHistory();

  const onEditGuest = async () => {
    setShowValidationErrorMessage(false);
    if (refNum.trim() === '' || contactNumber.trim() === '') {
      setShowValidationErrorMessage(true);
      return;
    }

    setIsUpdating(true);
    let url;
    if (passport[0].file) {
      url = await uploadPassport();
    }

    await updateDoc(doc(db, 'Library Guests', row.id), {
      name: `${firstName} ${lastName}`,
      refNum,
      email,
      country,
      city,
      occupation,
      adults,
      rooms,
      childrenAges,
      status,
      passport: url || passport[0],
      tel: contactNumber,
      updatedAt: serverTimestamp(),
    });

    setIsUpdating(false);
  };

  const uploadPassport = async () => (
    uploadImage(storage, 'library-guest', passport[0].data_url, passport[0].file.name)
  );

  return (
    <DivAtom>
      <DivAtom style={libraryCreateGuestStyles.header}>
        <IconAtom
          size="small"
          children={<ChevronLeftRoundedIcon />}
          style={libraryCreateGuestStyles.backBtn}
          onClick={() => history.replace('/library/guest')}
        />
        <H2Atom style={libraryCreateGuestStyles.title} text="Edit Guest" />
      </DivAtom>

      <CreateEditGuestForm
        width={width}
        btnText="Update"
        showValidationErrorMessage={showValidationErrorMessage}
        isCreating={isUpdating}
        refNum={refNum}
        setRefNum={setRefNum}
        firstName={firstName}
        lastName={lastName}
        country={country}
        city={city}
        status={status}
        contactNumber={contactNumber}
        email={email}
        occupation={occupation}
        adults={adults}
        rooms={rooms}
        childAge={childAge}
        childrenAges={childrenAges}
        passport={passport}
        setFirstName={setFirstName}
        setLastName={setLastName}
        setCountry={setCountry}
        setCity={setCity}
        setStatus={setStatus}
        setContactNumber={setContactNumber}
        setEmail={setEmail}
        setOccupation={setOccupation}
        setAdults={setAdults}
        setRooms={setRooms}
        setChildAge={setChildAge}
        setChildrenAges={setChildrenAges}
        setPassport={setPassport}
        onAddEditGuest={onEditGuest}
        isEdit
      />
    </DivAtom>
  );
}

export default EditGuest;
