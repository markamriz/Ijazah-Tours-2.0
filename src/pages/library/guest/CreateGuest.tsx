import { useState } from 'react';

import ChevronLeftRoundedIcon from '@material-ui/icons/ChevronLeftRounded';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

import DivAtom from '../../../atoms/DivAtom';
import H2Atom from '../../../atoms/H2Atom';
import IconAtom from '../../../atoms/IconAtom';
import { db } from '../../../firebase';
import CreateEditGuestForm from '../../../organisms/library/guest/CreateEditGuestForm';
import { selectWithNavbarWidth } from '../../../redux/containerSizeSlice';
import { selectUser } from '../../../redux/userSlice';
import { libraryCreateGuestStyles } from '../../../styles';
import { statusOptions, uploadImage } from '../../../utils/helpers';
import { CityDropdown, LocationDropdown } from '../../../utils/types';

const storage = getStorage();

interface CreateGuestProps {
  isCreating: boolean;
  setIsCreating: any;
}

function CreateGuest({
  isCreating,
  setIsCreating,
}: CreateGuestProps) {
  const user = useSelector(selectUser);
  const width = useSelector(selectWithNavbarWidth);

  const [refNum, setRefNum] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState<LocationDropdown>({ id: '', label: '', value: '' });
  const [city, setCity] = useState<CityDropdown>({
    label: '',
    value: '',
    countryId: '',
    countryName: '',
  });
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [occupation, setOccupation] = useState('');
  const [adults, setAdults] = useState(0);
  const [childAge, setChildAge] = useState(0);
  const [status, setStatus] = useState(statusOptions[0].value);
  const [childrenAges, setChildrenAges] = useState<number[]>([]);
  const [rooms, setRooms] = useState(0);
  const [passport, setPassport] = useState<any[]>([]);

  const [showValidationErrorMessage, setShowValidationErrorMessage] = useState(false);

  const [creatingReminder, setCreatingReminder] = useState(false);

  const history = useHistory();

  const onAddGuest = async () => {
    setShowValidationErrorMessage(false);
    if (refNum.trim() === '' || contactNumber.trim() === '') {
      setShowValidationErrorMessage(true);
      return;
    }

    setIsCreating(true);
    let url = '';
    if (passport[0]) {
      url = await uploadPassport();
    }

    await setDoc(doc(db, 'Library Guests', uuid()), {
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
      passport: url,
      tel: contactNumber,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    setIsCreating(false);
    clearInputs();
    localStorage.setItem('New Guest Ref Num', refNum);
    history.replace('/quote/quotations/create/customer');
  };

  const uploadPassport = async () => (
    uploadImage(storage, 'library-guest', passport[0].data_url, passport[0].file.name)
  );

  const clearInputs = () => {
    setRefNum('');
    setFirstName('');
    setLastName('');
    setEmail('');
    setCountry({ id: '', label: '', value: '' });
    setCity({
      label: '',
      value: '',
      countryId: '',
      countryName: '',
    });
    setOccupation('');
    setContactNumber('');
    setAdults(0);
    setRooms(0);
    setChildAge(0);
    setChildrenAges([]);
  };

  const onAddReminder = async () => {
    setShowValidationErrorMessage(false);
    if (refNum.trim() === '' || contactNumber.trim() === '') {
      setShowValidationErrorMessage(true);
      return;
    }

    setCreatingReminder(true);
    await onAddGuest();
    await setDoc(doc(db, 'Dashboard Tasks', `${refNum}-create-guest`), {
      title: '',
      status: 'Creation of Customer',
      stage: 'Q',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      completed: false,
      creator: user,
      refNum,
    });

    const startDate = new Date();
    const endDate = new Date();
    const calendarEvent = {
      summary: 'Creation of Customer',
      description: refNum ? `Reminder - Creation of Customer of Reference ${refNum}` : 'Reminder - Creation of Customer of Reference',
      start: {
        dateTime: startDate.toISOString(),
      },
      end: {
        dateTime: new Date(endDate.setDate(startDate.getDate() + 10)).toISOString(),
      },
    };

    const request = (window as any).gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: calendarEvent,
    });

    request.execute(() => setCreatingReminder(false));
  };

  return (
    <DivAtom>
      <DivAtom style={libraryCreateGuestStyles.header}>
        <IconAtom
          size="small"
          children={<ChevronLeftRoundedIcon />}
          style={libraryCreateGuestStyles.backBtn}
          onClick={() => history.replace('/library/guest')}
        />
        <H2Atom style={libraryCreateGuestStyles.title} text="Create Guest" />
      </DivAtom>

      <CreateEditGuestForm
        showValidationErrorMessage={showValidationErrorMessage}
        isCreating={isCreating}
        width={width}
        btnText="Create"
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
        onAddEditGuest={onAddGuest}
        onAddReminder={onAddReminder}
        creatingReminder={creatingReminder}
      />
    </DivAtom>
  );
}

export default CreateGuest;
