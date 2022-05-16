import { CircularProgress } from '@material-ui/core';

import ButtonAtom from '../../atoms/ButtonAtom';
import DivAtom from '../../atoms/DivAtom';
import ParagraphAtom from '../../atoms/ParagraphAtom';
import PhoneInputAtom from '../../atoms/PhoneInputAtom';
import FormControlInput from '../../molecules/FormControlInput';
import { userProfileStyles } from '../../styles';
import { widthHeightDynamicStyle } from '../../utils/helpers';
import { FlexDirection } from '../../utils/types';

interface UserProfileFormProps {
  width: number;
  isUpdating: boolean;
  showValidationErrorMessage: boolean;
  firstName: string;
  lastName: string;
  contactNumber: string;
  email: string;
  whatsApp: string;
  title: string;
  onUpdateUser: () => Promise<void>;
  onCancelUpdate: () => void;
  setFirstName: any;
  setLastName: any;
  setContactNumber: any;
  setEmail: any;
  setWhatsApp: any;
  setTitle: any;
}

function UserProfileForm({
  width,
  isUpdating,
  showValidationErrorMessage,
  firstName,
  lastName,
  contactNumber,
  email,
  whatsApp,
  title,
  setFirstName,
  setLastName,
  setContactNumber,
  setEmail,
  setWhatsApp,
  setTitle,
  onUpdateUser,
  onCancelUpdate,
}: UserProfileFormProps) {
  return (
    <>
      <DivAtom style={userProfileStyles.formContainer}>
        <DivAtom
          style={{
            ...userProfileStyles.multiFieldContainer,
            justifyContent: 'space-between',
            flexDirection: widthHeightDynamicStyle(width, 600, 'column', 'row') as FlexDirection,
          }}
        >
          <FormControlInput
            margin={widthHeightDynamicStyle(width, 600, '0 0 1rem 0', '0 1rem 1rem 0') as string}
            flex={1}
            label="First Name"
            fullWidth
            multiline={false}
            rows={1}
            value={firstName}
            setValue={setFirstName}
            placeholder="Enter First Name"
          />
          <FormControlInput
            margin="0 0 1rem 0"
            flex={1}
            label="Last Name"
            fullWidth
            multiline={false}
            rows={1}
            value={lastName}
            setValue={setLastName}
            placeholder="Enter Last Name"
          />
        </DivAtom>
        <DivAtom
          style={{
            ...userProfileStyles.multiFieldContainer,
            justifyContent: 'space-between',
            flexDirection: widthHeightDynamicStyle(width, 600, 'column', 'row') as FlexDirection,
          }}
        >
          <FormControlInput
            type="email"
            margin={widthHeightDynamicStyle(width, 600, '0 0 1rem 0', '0 1rem 1rem 0') as string}
            flex={1}
            label="Email"
            fullWidth
            disabled
            multiline={false}
            rows={1}
            value={email}
            setValue={setEmail}
            placeholder="Enter Email"
          />
          <PhoneInputAtom
            value={contactNumber}
            setContactNumber={setContactNumber}
            style={{ margin: widthHeightDynamicStyle(width, 600, '0 0 1rem 0', 0) as string }}
          />
        </DivAtom>
        <DivAtom
          style={{
            ...userProfileStyles.multiFieldContainer,
            justifyContent: 'space-between',
            flexDirection: widthHeightDynamicStyle(width, 600, 'column', 'row') as FlexDirection,
          }}
        >
          <FormControlInput
            margin={widthHeightDynamicStyle(width, 600, '0 0 1rem 0', '0 1rem 1rem 0') as string}
            flex={1}
            label="WhatsApp Number"
            fullWidth
            multiline={false}
            rows={1}
            value={whatsApp}
            setValue={setWhatsApp}
            placeholder="Enter WhatsApp Number"
          />
          <FormControlInput
            margin="0 0 1rem 0"
            flex={1}
            label="Title"
            fullWidth
            multiline={false}
            rows={1}
            value={title}
            setValue={setTitle}
            placeholder="Enter Title"
          />
        </DivAtom>
      </DivAtom>

      {showValidationErrorMessage && (
        <ParagraphAtom
          text="Please fill in the first name, last name & email"
          style={userProfileStyles.errorMsg}
        />
      )}

      <DivAtom
        style={{
          ...userProfileStyles.addBtnContainer,
          flexDirection: widthHeightDynamicStyle(width, 768, 'column', 'row') as FlexDirection,
          padding: widthHeightDynamicStyle(width, 768, '1rem', 0),
          margin: widthHeightDynamicStyle(width, 768, 0, userProfileStyles.addBtnContainer.margin),
        }}
      >
        <ButtonAtom
          size="large"
          onClick={onCancelUpdate}
          style={{
            ...userProfileStyles.addBtn,
            width: widthHeightDynamicStyle(width, 768, '100%', '18%'),
            margin: widthHeightDynamicStyle(width, 768, '0 0 1rem 0', 0),
          }}
          text="Cancel"
        />
        <ButtonAtom
          size="large"
          endIcon={isUpdating && <CircularProgress size={20} color="inherit" />}
          onClick={onUpdateUser}
          disabled={isUpdating}
          style={{
            ...userProfileStyles.addBtn,
            width: widthHeightDynamicStyle(width, 768, '100%', '18%'),
            margin: widthHeightDynamicStyle(width, 768, '0 0 1rem 0', ' 0 0 0 1rem'),
          }}
          text="Save"
        />
      </DivAtom>
    </>
  );
}

export default UserProfileForm;
