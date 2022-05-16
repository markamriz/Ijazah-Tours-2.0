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
import CreateEditDriverForm from '../../../organisms/library/driver/CreateEditDriverForm';
import { selectWithNavbarWidth } from '../../../redux/containerSizeSlice';
import { libraryDriverStyles } from '../../../styles';
import { uploadImage } from '../../../utils/helpers';
import { LibraryDriver } from '../../../utils/types';

const storage = getStorage();

interface EditDriverProps {
  row: LibraryDriver;
  isUpdating: boolean;
  setIsUpdating: any;
}

function EditDriver({ row, isUpdating, setIsUpdating }: EditDriverProps) {
  const width = useSelector(selectWithNavbarWidth);

  const [firstName, setFirstName] = useState(row.name.split(' ')[0]);
  const [lastName, setLastName] = useState(row.name.split(' ')[1]);
  const [contactNumber, setContactNumber] = useState(row.tel);
  const [email, setEmail] = useState(row.email);
  const [nic, setNic] = useState(row.nic);
  const [boardCertNum, setBoardCertNum] = useState(row.boardCertNum);
  const [address, setAddress] = useState(row.address);
  const [vehicleType, setVehicleType] = useState(row.vehicleType);
  const [status, setStatus] = useState(row.status);
  const [rate, setRate] = useState(row.rate);
  const [notes, setNotes] = useState(row.notes);
  const [languages, setLanguages] = useState([row.languages[0], row.languages[1]]);
  const [insurance, setInsurance] = useState<any[]>([row.insurance]);
  const [profilePic, setProfilePic] = useState<any[]>([row.profilePic]);
  const [vehiclePic, setVehiclePic] = useState<any[]>([row.vehiclePic]);

  const [showValidationErrorMessage, setShowValidationErrorMessage] = useState(false);

  const history = useHistory();

  const onEditDriver = async () => {
    setShowValidationErrorMessage(false);
    if (firstName.trim() === '' || lastName.trim() === '' || nic.trim() === ''
      || boardCertNum.trim() === '' || contactNumber.trim() === '' || email.trim() === ''
      || address.trim() === '' || vehicleType.trim() === '' || status.trim() === ''
      || rate.trim() === '' || notes.trim() === '' || insurance.length === 0 || !insurance
      || profilePic.length === 0 || !profilePic || vehiclePic.length === 0 || !vehiclePic) {
      setShowValidationErrorMessage(true);
      return;
    }

    setIsUpdating(true);
    let insuUrl;
    let profUrl;
    let vehiUrl;
    if (insurance[0].file) {
      insuUrl = await uploadInsurance();
    }
    if (profilePic[0].file) {
      profUrl = await uploadProfilePic();
    }
    if (vehiclePic[0].file) {
      vehiUrl = await uploadVehiclePic();
    }

    const selectedLanguages = [];
    if (languages[0]) {
      selectedLanguages.push('English');
    }
    if (languages[1]) {
      selectedLanguages.push('Arabic');
    }

    await updateDoc(doc(db, 'Library Drivers', row.id), {
      name: `${firstName} ${lastName}`,
      email,
      tel: contactNumber,
      nic,
      boardCertNum,
      address,
      vehicleType,
      status,
      rate,
      notes,
      insurance: insuUrl || insurance[0],
      profilePic: profUrl || profilePic[0],
      vehiclePic: vehiUrl || vehiclePic[0],
      languages: selectedLanguages,
      updatedAt: serverTimestamp(),
    });

    setIsUpdating(false);
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
        <H2Atom style={libraryDriverStyles.title} text="Edit Driver" />
      </DivAtom>

      <CreateEditDriverForm
        showValidationErrorMessage={showValidationErrorMessage}
        isCreating={isUpdating}
        width={width}
        btnText="Update"
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
        onAddEditDriver={onEditDriver}
      />
    </DivAtom>
  );
}

export default EditDriver;
