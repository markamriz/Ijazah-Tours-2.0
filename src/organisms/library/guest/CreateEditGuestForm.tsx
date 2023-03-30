import { ChangeEvent } from 'react';

import {
  CircularProgress,
  Input,
  MenuItem,
  Select,
} from '@material-ui/core';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import { City, Country } from 'country-state-city';
import { v4 as uuid } from 'uuid';

import ImageUploader from './ImageUploader';
import ButtonAtom from '../../../atoms/ButtonAtom';
import DivAtom from '../../../atoms/DivAtom';
import H2Atom from '../../../atoms/H2Atom';
import IconAtom from '../../../atoms/IconAtom';
import ParagraphAtom from '../../../atoms/ParagraphAtom';
import PhoneInputAtom from '../../../atoms/PhoneInputAtom';
import TextFieldAtom from '../../../atoms/TextFieldAtom';
import FormControlInput from '../../../molecules/FormControlInput';
import { libraryCreateGuestStyles, libraryStyles } from '../../../styles';
import { MenuProps, statusOptions, widthHeightDynamicStyle } from '../../../utils/helpers';
import { CityDropdown, FlexDirection, LocationDropdown } from '../../../utils/types';

interface CreateEditGuestFormProps {
  width: number;
  adults: number;
  rooms: number;
  childAge: number;
  isCreating: boolean;
  showValidationErrorMessage: boolean;
  btnText: string;
  refNum: string;
  firstName: string;
  lastName: string;
  country: LocationDropdown;
  city: CityDropdown;
  status: string;
  contactNumber: string;
  email: string;
  occupation: string;
  onAddEditGuest: () => Promise<void>;
  childrenAges: number[];
  passport: any[];
  setRefNum: any;
  setFirstName: any;
  setLastName: any;
  setCountry: any;
  setCity: any;
  setStatus: any;
  setContactNumber: any;
  setEmail: any;
  setOccupation: any;
  setAdults: any;
  setRooms: any;
  setChildAge: any;
  setChildrenAges: any;
  setPassport: any;
  creatingReminder?: boolean;
  isEdit?: boolean;
  onAddReminder?: () => void;
}

function CreateEditGuestForm({
  width,
  adults,
  rooms,
  childAge,
  isCreating,
  showValidationErrorMessage,
  btnText,
  refNum,
  firstName,
  lastName,
  country,
  city,
  status,
  contactNumber,
  email,
  occupation,
  onAddEditGuest,
  childrenAges,
  passport,
  setRefNum,
  setFirstName,
  setLastName,
  setCountry,
  setCity,
  setStatus,
  setContactNumber,
  setEmail,
  setOccupation,
  setAdults,
  setRooms,
  setChildAge,
  setChildrenAges,
  setPassport,
  creatingReminder,
  isEdit,
  onAddReminder,
}: CreateEditGuestFormProps) {
  const countries = Country.getAllCountries();

  const updatedCountries = countries?.map((c) => ({
    label: c.name,
    value: c.name,
    id: c.isoCode,
  }));

  const updatedStates = (id: string) => (
    City.getCitiesOfCountry(id)
      ?.map((state) => ({ label: state.name, value: state.name }))
  );

  const onCountryChange = (val: string) => {
    const countryCode = countries.find((c) => c.name === val)?.isoCode;
    if (countryCode) {
      setCountry({ id: countryCode, label: val, value: val });
    }

    setCity({
      label: '',
      value: '',
      countryId: '',
      countryName: '',
    });
  };

  const handleCitiesChange = (event: ChangeEvent<{ value: unknown }>) => {
    const val = event.target.value as string;
    setCity({
      countryId: country.id,
      countryName: country.value,
      label: val,
      value: val,
    });
  };

  const getAgeString = (age: number) => (age === 1 ? `${age} year old` : `${age} years old`);

  const onRemoveChildAge = (i: number) => {
    const childrenAgesCopy = [...childrenAges];
    childrenAgesCopy.splice(i, 1);
    setChildrenAges(childrenAgesCopy);
  };

  return (
    <>
      <DivAtom style={libraryCreateGuestStyles.formContainer}>
        <DivAtom
          style={{
            ...libraryCreateGuestStyles.multiFieldContainer,
            justifyContent: 'space-between',
            flexDirection: widthHeightDynamicStyle(width, 600, 'column', 'row') as FlexDirection,
          }}
        >
          <FormControlInput
            margin={widthHeightDynamicStyle(width, 600, '0 0 1rem 0', '0 1rem 1rem 0') as string}
            flex={1}
            label="Reference Number"
            fullWidth
            multiline={false}
            rows={1}
            value={refNum}
            setValue={setRefNum}
            placeholder="Enter Reference Number"
            disabled={isEdit}
          />
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
            margin={widthHeightDynamicStyle(width, 600, '0 0 1rem 0', '0 1rem 1rem 0') as string}
            flex={1}
            label="Last Name"
            fullWidth
            multiline={false}
            rows={1}
            value={lastName}
            setValue={setLastName}
            placeholder="Enter Last Name"
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
            }}
            disableUnderline={false}
            select
          />
        </DivAtom>
        <DivAtom
          style={{
            ...libraryCreateGuestStyles.multiFieldContainer,
            justifyContent: 'space-between',
            flexDirection: widthHeightDynamicStyle(width, 600, 'column', 'row') as FlexDirection,
          }}
        >
          <TextFieldAtom
            variant="standard"
            size="medium"
            label="Location"
            value={country.value}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onCountryChange(e.target.value)}
            options={updatedCountries}
            adornmentPosition="end"
            style={{
              margin: widthHeightDynamicStyle(width, 600, '0 0 1rem 0', '0 1rem 1rem 0') as string,
              flex: 1,
            }}
            disableUnderline={false}
            select
          />

          <Select
            labelId="cities-label"
            id="cities"
            placeholder="Cities"
            value={city.value}
            onChange={handleCitiesChange}
            input={<Input />}
            MenuProps={MenuProps}
            style={{
              margin: '0 0 1rem 0',
              flex: 1,
            }}
          >
            {updatedStates(country.id)?.map((c) => (
              <MenuItem key={uuid()} value={c.value}>
                {c.label}
              </MenuItem>
            ))}
          </Select>
        </DivAtom>
        <DivAtom
          style={{
            ...libraryCreateGuestStyles.multiFieldContainer,
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
        <FormControlInput
          margin="0 0 1rem 0"
          label="Occupation"
          fullWidth
          multiline={false}
          rows={1}
          value={occupation}
          setValue={setOccupation}
          placeholder="Enter Occupation"
        />
        <DivAtom
          style={{
            ...libraryCreateGuestStyles.multiFieldContainer,
            justifyContent: 'space-between',
            flexDirection: widthHeightDynamicStyle(width, 600, 'column', 'row') as FlexDirection,
          }}
        >
          <FormControlInput
            margin={widthHeightDynamicStyle(width, 600, '0 0 1rem 0', '0 1rem 1rem 0') as string}
            flex={1}
            type="number"
            label="Adults"
            fullWidth
            multiline={false}
            rows={1}
            value={adults}
            setValue={setAdults}
            placeholder="Enter No. of Adults"
          />
          <FormControlInput
            margin="0 0 1rem 0"
            flex={1}
            type="number"
            label="Rooms"
            fullWidth
            multiline={false}
            rows={1}
            value={rooms}
            setValue={setRooms}
            placeholder="Enter No. of Rooms"
          />
        </DivAtom>
        <DivAtom>
          <DivAtom
            style={{
              ...libraryCreateGuestStyles.multiFieldContainer,
              justifyContent: 'flex-start',
              flexDirection: widthHeightDynamicStyle(width, 768, 'column', 'row') as FlexDirection,
            }}
          >
            <FormControlInput
              margin={widthHeightDynamicStyle(width, 768, '0 0 1rem 0', '0 1rem 1rem 0') as string}
              type="number"
              label="Childs Age"
              fullWidth
              multiline={false}
              rows={1}
              value={childAge}
              setValue={setChildAge}
              placeholder="Enter Childs Age"
            />
            <ButtonAtom
              size="large"
              onClick={() => setChildrenAges([...childrenAges, childAge])}
              style={{
                ...libraryCreateGuestStyles.addBtn,
                width: widthHeightDynamicStyle(width, 768, '100%', '18%'),
                height: '100%',
                margin: widthHeightDynamicStyle(width, 768, '0 0 1rem 0', '0.5rem 0 0 1rem'),
              }}
              text="Add Child"
            />
          </DivAtom>
          <H2Atom text="All Children Ages" style={libraryCreateGuestStyles.subtitle} />
          <ul>
            {childrenAges.map((age, i) => (
              <DivAtom key={uuid()} style={{ display: 'flex', alignItems: 'center' }}>
                <li>{getAgeString(Number(age))}</li>
                <IconAtom size="small" onClick={() => onRemoveChildAge && onRemoveChildAge(i)} style={{ color: 'red' }}>
                  <DeleteOutlinedIcon />
                </IconAtom>
              </DivAtom>
            ))}
          </ul>
        </DivAtom>
      </DivAtom>

      <DivAtom>
        <ImageUploader
          passport={passport}
          setPassport={setPassport}
        />
      </DivAtom>

      {showValidationErrorMessage && (
        <ParagraphAtom
          text="Please fill in all the required fields"
          style={libraryCreateGuestStyles.errorMsg}
        />
      )}

      <DivAtom
        style={{
          ...libraryCreateGuestStyles.addBtnContainer,
          flexDirection: widthHeightDynamicStyle(width, 768, 'column', 'row') as FlexDirection,
          padding: widthHeightDynamicStyle(width, 768, '1rem', 0),
          margin: widthHeightDynamicStyle(
            width,
            768,
            0,
            libraryCreateGuestStyles.addBtnContainer.margin,
          ),
        }}
      >
        <ButtonAtom
          size="large"
          endIcon={isCreating && <CircularProgress size={20} color="inherit" />}
          onClick={onAddEditGuest}
          disabled={isCreating}
          style={{
            ...libraryCreateGuestStyles.addBtn,
            width: widthHeightDynamicStyle(width, 768, '100%', '18%'),
            margin: widthHeightDynamicStyle(width, 768, '0 0 1rem 0', ' 0 0 0 1rem'),
          }}
          text={btnText}
        />
        {onAddReminder && (
          <ButtonAtom
            size="large"
            onClick={onAddReminder}
            style={{
              ...libraryCreateGuestStyles.addBtn,
              width: widthHeightDynamicStyle(width, 768, '100%', '18%'),
            }}
            text="Add Reminder"
            disabled={creatingReminder}
            endIcon={creatingReminder && <CircularProgress size={20} color="inherit" />}
          />
        )}
      </DivAtom>
    </>
  );
}

export default CreateEditGuestForm;
