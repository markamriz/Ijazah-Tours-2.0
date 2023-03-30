import { ChangeEvent } from 'react';

import { CircularProgress } from '@material-ui/core';

import ImageUploader from './ImageUploader';
import ButtonAtom from '../../../atoms/ButtonAtom';
import DivAtom from '../../../atoms/DivAtom';
import ParagraphAtom from '../../../atoms/ParagraphAtom';
import PhoneInputAtom from '../../../atoms/PhoneInputAtom';
import TextFieldAtom from '../../../atoms/TextFieldAtom';
import CheckboxGroup from '../../../molecules/CheckboxGroup';
import FormControlInput from '../../../molecules/FormControlInput';
import { libraryDriverStyles, libraryStyles } from '../../../styles';
import { statusOptions, vehicleOptions, widthHeightDynamicStyle } from '../../../utils/helpers';
import { FlexDirection } from '../../../utils/types';

interface CreateEditDriverFormProps {
  width: number;
  isCreating: boolean;
  showValidationErrorMessage: boolean;
  btnText: string,
  firstName: string;
  lastName: string;
  nic: string;
  boardCertNum: string;
  vehicleType: string;
  status: string;
  rate: string;
  notes: string;
  contactNumber: string;
  email: string;
  address: string;
  languages: boolean[];
  insurance: any[];
  profilePic: any[];
  vehiclePic: any[];
  setFirstName: any;
  setLastName: any;
  setNic: any;
  setBoardCertNum: any;
  setVehicleType: any;
  setStatus: any;
  setRate: any;
  setNotes: any;
  setContactNumber: any;
  setEmail: any;
  setAddress: any;
  setInsurance: any;
  setProfilePic: any;
  setVehiclePic: any;
  onChangeLanguage: (i: number) => void;
  onAddEditDriver: () => Promise<void>;
}

function CreateEditDriverForm({
  width,
  btnText,
  isCreating,
  showValidationErrorMessage,
  firstName,
  lastName,
  nic,
  boardCertNum,
  vehicleType,
  status,
  rate,
  notes,
  contactNumber,
  email,
  address,
  languages,
  insurance,
  profilePic,
  vehiclePic,
  setFirstName,
  setLastName,
  setNic,
  setBoardCertNum,
  setVehicleType,
  setStatus,
  setRate,
  setNotes,
  setContactNumber,
  setEmail,
  setAddress,
  setInsurance,
  setProfilePic,
  setVehiclePic,
  onChangeLanguage,
  onAddEditDriver,
}: CreateEditDriverFormProps) {
  return (
    <>
      <DivAtom style={libraryDriverStyles.formContainer}>
        <DivAtom
          style={{
            ...libraryDriverStyles.multiFieldContainer,
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
            ...libraryDriverStyles.multiFieldContainer,
            justifyContent: 'space-between',
            flexDirection: widthHeightDynamicStyle(width, 600, 'column', 'row') as FlexDirection,
          }}
        >
          <FormControlInput
            margin={widthHeightDynamicStyle(width, 600, '0 0 1rem 0', '0 1rem 1rem 0') as string}
            flex={1}
            label="NIC"
            fullWidth
            multiline={false}
            rows={1}
            value={nic}
            setValue={setNic}
            placeholder="Enter NIC"
          />
          <FormControlInput
            margin="0 0 1rem 0"
            flex={1}
            label="Tourist Board Certificate Number"
            fullWidth
            multiline={false}
            rows={1}
            value={boardCertNum}
            setValue={setBoardCertNum}
            placeholder="Enter Tourist Board Certificate Number"
          />
        </DivAtom>
        <DivAtom
          style={{
            ...libraryDriverStyles.multiFieldContainer,
            flexDirection: widthHeightDynamicStyle(width, 600, 'column', 'row') as FlexDirection,
          }}
        >
          <TextFieldAtom
            variant="standard"
            size="medium"
            label="Vehicle"
            value={vehicleType}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setVehicleType(e.target.value)}
            options={vehicleOptions}
            adornmentPosition="end"
            style={{
              ...libraryStyles.textField,
              flex: 1,
              width: widthHeightDynamicStyle(width, 600, '100%', 'auto'),
              margin: '0 1rem 1rem 0',
            }}
            disableUnderline={false}
            select
          />
          <TextFieldAtom
            variant="standard"
            size="medium"
            label="Status"
            value={status}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setStatus(e.target.value)}
            options={statusOptions}
            adornmentPosition="end"
            style={{
              ...libraryStyles.textField,
              flex: 1,
              width: widthHeightDynamicStyle(width, 600, '100%', 'auto'),
              margin: '0 1rem 1rem 0',
            }}
            disableUnderline={false}
            select
          />
          <FormControlInput
            margin="0 0 1rem 0"
            flex={1}
            label="Rate"
            fullWidth
            multiline={false}
            rows={1}
            value={rate}
            setValue={setRate}
            placeholder="Enter Rate"
            dollarAdornment
          />
          <CheckboxGroup
            groupTitle="Language"
            labels={['English', 'Arabic']}
            names={['english', 'arabic']}
            checked={languages}
            onChange={(_, i: number) => onChangeLanguage(i)}
            style={{ flexDirection: 'row' }}
          />
        </DivAtom>
        <FormControlInput
          margin="0 0 1rem 0"
          flex={1}
          label="Notes"
          fullWidth
          multiline
          rows={2}
          value={notes}
          setValue={setNotes}
          placeholder="Enter Notes"
        />
        <DivAtom
          style={{
            ...libraryDriverStyles.multiFieldContainer,
            justifyContent: 'space-between',
            flexDirection: widthHeightDynamicStyle(width, 600, 'column', 'row') as FlexDirection,
          }}
        >
          <PhoneInputAtom
            value={contactNumber}
            setContactNumber={setContactNumber}
            style={{ margin: widthHeightDynamicStyle(width, 600, '0 0 1rem 0', '0 1rem 0rem 0') as string }}
          />
          <FormControlInput
            type="email"
            margin="0 0 1rem 0"
            flex={1}
            label="Email"
            fullWidth
            multiline={false}
            rows={1}
            value={email}
            setValue={setEmail}
            placeholder="Enter Email"
          />
        </DivAtom>
        <DivAtom
          style={{
            ...libraryDriverStyles.multiFieldContainer,
            flexDirection: widthHeightDynamicStyle(width, 600, 'column', 'row') as FlexDirection,
          }}
        >
          <FormControlInput
            margin="0 0 1rem 0"
            label="Address"
            fullWidth
            flex={1}
            multiline={false}
            rows={1}
            value={address}
            setValue={setAddress}
            placeholder="Enter Address"
          />
        </DivAtom>
      </DivAtom>

      <DivAtom>
        <ImageUploader
          insurance={insurance}
          setInsurance={setInsurance}
          profilePic={profilePic}
          setProfilePic={setProfilePic}
          vehiclePic={vehiclePic}
          setVehiclePic={setVehiclePic}
        />
      </DivAtom>

      {showValidationErrorMessage && (
        <ParagraphAtom
          text="Please fill in all the fields"
          style={libraryDriverStyles.errorMsg}
        />
      )}

      <DivAtom
        style={{
          ...libraryDriverStyles.addBtnContainer,
          padding: widthHeightDynamicStyle(width, 768, '1rem', 0),
          margin: widthHeightDynamicStyle(width, 768, '0px', libraryDriverStyles.addBtnContainer.margin),
        }}
      >
        <ButtonAtom
          size="large"
          endIcon={isCreating && <CircularProgress size={20} color="inherit" />}
          onClick={onAddEditDriver}
          disabled={isCreating}
          style={{
            ...libraryDriverStyles.addBtn,
            width: widthHeightDynamicStyle(width, 768, '100%', '18%'),
            margin: widthHeightDynamicStyle(width, 768, '0 0 1rem 0', 0),
          }}
          text={btnText}
        />
      </DivAtom>
    </>
  );
}

export default CreateEditDriverForm;
