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
import CreateEditDriverForm from '../../../organisms/library/driver/CreateEditDriverForm';
import { selectWithNavbarWidth } from '../../../redux/containerSizeSlice';
import { libraryDriverStyles } from '../../../styles';
import { statusOptions, uploadImage, vehicleOptions } from '../../../utils/helpers';

const storage = getStorage();

interface CreateDriverProps {
  isCreating: boolean;
  setIsCreating: any;
}

function CreateDriver({
  isCreating,
  setIsCreating,
}: CreateDriverProps) {
  const width = useSelector(selectWithNavbarWidth);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [nic, setNic] = useState('');
  const [boardCertNum, setBoardCertNum] = useState('');
  const [address, setAddress] = useState('');
  const [vehicleType, setVehicleType] = useState(vehicleOptions[0].value);
  const [status, setStatus] = useState(statusOptions[0].value);
  const [rate, setRate] = useState('');
  const [notes, setNotes] = useState('');
  const [languages, setLanguages] = useState(new Array(2).fill(false));
  const [insurance, setInsurance] = useState<any[]>([]);
  const [profilePic, setProfilePic] = useState<any[]>([]);
  const [vehiclePic, setVehiclePic] = useState<any[]>([]);

  const [showValidationErrorMessage, setShowValidationErrorMessage] = useState(false);

  const history = useHistory();

  const onAddDriver = async () => {
    setShowValidationErrorMessage(false);
    if (firstName.trim() === '' || lastName.trim() === '' || nic.trim() === ''
      || contactNumber.trim() === '') {
      setShowValidationErrorMessage(true);
      return;
    }

    setIsCreating(true);
    const [insuranceUrl, profilePicUrl, vehiclePicUrl] = await uploadImages();
    const selectedLanguages = [];
    if (languages[0]) {
      selectedLanguages.push('English');
    }
    if (languages[1]) {
      selectedLanguages.push('Arabic');
    }

    await setDoc(doc(db, 'Library Drivers', uuid()), {
      name: `${firstName} ${lastName}`,
      email,
      tel: contactNumber,
      nic,
      boardCertNum,
      address,
      vehicleType,
      status,
      rate: `$${rate}`,
      notes,
      insurance: insuranceUrl,
      profilePic: profilePicUrl,
      vehiclePic: vehiclePicUrl,
      languages: selectedLanguages,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    setIsCreating(false);
    clearInputs();
    history.replace('/library/driver');
  };

  const uploadInsurance = async () => (
    uploadImage(storage, 'library-driver', insurance[0].data_url, insurance[0].file.name)
  );
  const uploadProfilePic = async () => (
    uploadImage(storage, 'library-driver', profilePic[0].data_url, profilePic[0].file.name)
  );
  const uploadVehiclePic = async () => (
    uploadImage(storage, 'library-driver', vehiclePic[0].data_url, vehiclePic[0].file.name)
  );

  const uploadImages = async () => [
    await uploadInsurance(),
    await uploadProfilePic(),
    await uploadVehiclePic(),
  ];

  const clearInputs = () => {
    setFirstName('');
    setLastName('');
    setContactNumber('');
    setEmail('');
    setNic('');
    setBoardCertNum('');
    setAddress('');
    setRate('');
    setNotes('');
    setInsurance([]);
    setProfilePic([]);
    setVehiclePic([]);
  };

  const onChangeLanguage = (i: number) => {
    const updatedCheckedState = languages.map((lang, index) => (index === i ? !lang : lang));
    setLanguages(updatedCheckedState);
  };

  return (
    <DivAtom>
      <DivAtom style={libraryDriverStyles.header}>
        <IconAtom
          size="small"
          children={<ChevronLeftRoundedIcon />}
          style={libraryDriverStyles.backBtn}
          onClick={() => history.replace('/library/driver')}
        />
        <H2Atom style={libraryDriverStyles.title} text="Create Driver" />
      </DivAtom>

      <CreateEditDriverForm
        showValidationErrorMessage={showValidationErrorMessage}
        isCreating={isCreating}
        width={width}
        btnText="Create"
        firstName={firstName}
        lastName={lastName}
        nic={nic}
        boardCertNum={boardCertNum}
        vehicleType={vehicleType}
        status={status}
        rate={rate}
        notes={notes}
        contactNumber={contactNumber}
        email={email}
        address={address}
        languages={languages}
        insurance={insurance}
        profilePic={profilePic}
        vehiclePic={vehiclePic}
        setFirstName={setFirstName}
        setLastName={setLastName}
        setNic={setNic}
        setBoardCertNum={setBoardCertNum}
        setVehicleType={setVehicleType}
        setStatus={setStatus}
        setRate={setRate}
        setNotes={setNotes}
        setContactNumber={setContactNumber}
        setEmail={setEmail}
        setAddress={setAddress}
        setInsurance={setInsurance}
        setProfilePic={setProfilePic}
        setVehiclePic={setVehiclePic}
        onChangeLanguage={onChangeLanguage}
        onAddEditDriver={onAddDriver}
      />
    </DivAtom>
  );
}

export default CreateDriver;
