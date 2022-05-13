import { useState } from 'react';

import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';

import DivAtom from '../../atoms/DivAtom';
import { db } from '../../firebase';
import UserProfileForm from '../../organisms/profile/UserProfileForm';
import { selectWithoutNavbarHeight, selectWithoutNavbarWidth } from '../../redux/containerSizeSlice';
import { login, selectUser } from '../../redux/userSlice';
import { userProfileStyles } from '../../styles';

function UserProfile() {
  const user = useSelector(selectUser);
  const height = useSelector(selectWithoutNavbarHeight);
  const width = useSelector(selectWithoutNavbarWidth);

  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [title, setTitle] = useState(user.title);
  const [email, setEmail] = useState(user.email);
  const [contactNumber, setContactNumber] = useState(user.contactNumber);
  const [whatsApp, setWhatsApp] = useState(user.whatsApp);

  const [isUpdating, setIsUpdating] = useState(false);
  const [showValidationErrorMessage, setShowValidationErrorMessage] = useState(false);

  const dispatch = useDispatch();

  const onUpdateUser = async () => {
    setShowValidationErrorMessage(false);
    if (firstName.trim() === '' || lastName.trim() === '' || email.trim() === '') {
      setShowValidationErrorMessage(true);
      return;
    }

    setIsUpdating(true);
    await updateDoc(doc(db, 'Team Members', user.id), {
      firstName,
      lastName,
      title,
      contactNumber,
      whatsApp,
      updatedAt: serverTimestamp(),
    });
    dispatch(login({
      id: user.id,
      role: user.role,
      email: user.email,
      profileImg: user.profileImg,
      status: user.status,
      firstName,
      lastName,
      title,
      contactNumber,
      whatsApp,
    }));

    setIsUpdating(false);
  };

  const onCancelUpdate = () => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setContactNumber(user.contactNumber);
    setWhatsApp(user.whatsApp);
    setTitle(user.title);
  };

  return (
    <DivAtom style={userProfileStyles.container}>
      <DivAtom
        style={{
          ...userProfileStyles.innerContainer,
          height: `${height}px`,
        }}
      >
        <UserProfileForm
          width={width}
          isUpdating={isUpdating}
          showValidationErrorMessage={showValidationErrorMessage}
          firstName={firstName}
          lastName={lastName}
          contactNumber={contactNumber}
          email={email}
          whatsApp={whatsApp}
          title={title}
          onUpdateUser={onUpdateUser}
          onCancelUpdate={onCancelUpdate}
          setFirstName={setFirstName}
          setLastName={setLastName}
          setContactNumber={setContactNumber}
          setEmail={setEmail}
          setWhatsApp={setWhatsApp}
          setTitle={setTitle}
        />
      </DivAtom>
    </DivAtom>
  );
}

export default UserProfile;
