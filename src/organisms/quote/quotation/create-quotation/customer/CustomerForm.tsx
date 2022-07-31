import { ChangeEvent, MouseEvent } from 'react';

import { Input, MenuItem, Select } from '@material-ui/core';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import { Country } from 'country-state-city';
import { Link } from 'react-router-dom';

import ButtonAtom from '../../../../../atoms/ButtonAtom';
import CheckboxAtom from '../../../../../atoms/CheckboxAtom';
import DivAtom from '../../../../../atoms/DivAtom';
import ParagraphAtom from '../../../../../atoms/ParagraphAtom';
import PhoneInputAtom from '../../../../../atoms/PhoneInputAtom';
import TextFieldAtom from '../../../../../atoms/TextFieldAtom';
import FormControlInput from '../../../../../molecules/FormControlInput';
import RadioButtonGroup from '../../../../../molecules/RadioButtonGroup';
import { libraryStyles, quoteCreateQuoteStyles, TableToolbarStyles } from '../../../../../styles';
import {
  dateTypeOptions,
  mealPlanOptions,
  MenuProps,
  widthHeightDynamicStyle,
} from '../../../../../utils/helpers';
import {
  DropdownOption,
  FlexDirection,
  LibraryGuest,
  SettingsLocation,
} from '../../../../../utils/types';
import { RenderDatePicker } from '../../RenderDatePicker';

interface CustomerFormProps {
  customerData: LibraryGuest[];
  accomodationLocationData: SettingsLocation[];
  refData: DropdownOption[];
  holidayTypeData: DropdownOption[];
  destinations: string[];
  width: number;
  notSpecificDays: number;
  refNum: string;
  title: string;
  firstName: string;
  lastName: string;
  contactNumber: string
  email: string;
  country: string;
  city: string;
  holidayType: string
  mealPlan: string;
  dateType: string;
  checkin: string;
  checkout: string;
  additionalBed: boolean;
  invalidDate: boolean;
  onCreateCustomer: (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
  onRefNumChange: (data: LibraryGuest[], rf: string) => void;
  setTitle: any;
  setNotSpecificDays: any;
  setFirstName: any;
  setLastName: any;
  setContactNumber: any;
  setEmail: any;
  setCountry: any;
  setCity: any;
  setHolidayType: any;
  setDestinations: any;
  setToStoreDestinations: any;
  setMealPlan: any;
  setAdditionalBed: any;
  setDateType: any;
  setCheckin: any;
  setCheckout: any
}

function CustomerForm({
  customerData,
  refData,
  holidayTypeData,
  width,
  notSpecificDays,
  title,
  refNum,
  firstName,
  lastName,
  contactNumber,
  email,
  country,
  city,
  holidayType,
  destinations,
  mealPlan,
  dateType,
  checkin,
  checkout,
  additionalBed,
  invalidDate,
  onCreateCustomer,
  onRefNumChange,
  setTitle,
  setNotSpecificDays,
  setFirstName,
  setLastName,
  setContactNumber,
  setEmail,
  setCountry,
  setCity,
  setHolidayType,
  setDestinations,
  setToStoreDestinations,
  setMealPlan,
  setAdditionalBed,
  setDateType,
  setCheckin,
  setCheckout,
}: CustomerFormProps) {
  const countries = Country.getAllCountries();

  const changeDateType = (type: string) => {
    setDateType(type);
    localStorage.removeItem('New Quote Accomodation');

    if (type === dateTypeOptions[1].value) {
      setCheckin('2022-01');
      setCheckout('2022-02');
    } else {
      setCheckin(new Date().toISOString().split('T')[0]);
      setCheckout(new Date().toISOString().split('T')[0]);
    }
  };

  const handleDestinationsChange = (event: ChangeEvent<{ value: unknown }>) => {
    const val = event.target.value as string[];
    setDestinations(val);
    setToStoreDestinations(val);
  };

  return (
    <>
      <DivAtom style={quoteCreateQuoteStyles.formContainer}>
        <ParagraphAtom
          style={{
            ...quoteCreateQuoteStyles.title,
            marginBottom: '1rem',
          }}
          text="Guest"
        />
        <FormControlInput
          margin={widthHeightDynamicStyle(width, 600, '0 0 1rem 0', '0 1rem 1rem 0') as string}
          flex={1}
          label="Title"
          fullWidth
          multiline={false}
          rows={1}
          value={title}
          setValue={setTitle}
          placeholder="Enter Title"
        />
        <DivAtom
          style={{
            ...quoteCreateQuoteStyles.multiFieldContainer,
            flexDirection: widthHeightDynamicStyle(width, 600, 'column', 'row') as FlexDirection,
          }}
        >
          <TextFieldAtom
            variant="standard"
            size="medium"
            label="Reference Number"
            value={refNum}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => (
              onRefNumChange(customerData, e.target.value)
            )}
            options={refData}
            adornmentPosition="end"
            style={{
              ...libraryStyles.textField,
              flex: 1,
              width: widthHeightDynamicStyle(width, 600, '100%', 'auto'),
            }}
            disableUnderline={false}
            select
          />
          <Link to={'/library/guest/create'}>
            <ButtonAtom
              startIcon={<AddCircleOutlineOutlinedIcon />}
              text="Add New Guest"
              style={{
                ...TableToolbarStyles.addBtn,
                width: widthHeightDynamicStyle(width, 600, '100%', '11rem'),
                marginTop: '1rem',
                marginLeft: widthHeightDynamicStyle(width, 600, 0, '1rem'),
              }}
              size="large"
            />
          </Link>
        </DivAtom>
        <DivAtom
          style={{
            ...quoteCreateQuoteStyles.multiFieldContainer,
            flexDirection: widthHeightDynamicStyle(width, 600, 'column', 'row') as FlexDirection,
          }}
        >
          <FormControlInput
            margin={widthHeightDynamicStyle(width, 600, '0 0 1rem 0', '0 1rem 1rem 0') as string}
            flex={1}
            label="First Name"
            fullWidth
            disabled
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
            disabled
            multiline={false}
            rows={1}
            value={lastName}
            setValue={setLastName}
            placeholder="Enter Last Name"
          />
        </DivAtom>
        <DivAtom
          style={{
            ...quoteCreateQuoteStyles.multiFieldContainer,
            flexDirection: widthHeightDynamicStyle(width, 600, 'column', 'row') as FlexDirection,
          }}
        >
          <PhoneInputAtom
            value={contactNumber}
            setContactNumber={setContactNumber}
            style={{ margin: widthHeightDynamicStyle(width, 600, '0 0 1rem 0', '0 1rem 0rem 0') as string }}
            disabled
          />
          <FormControlInput
            margin="0 0 1rem 0"
            label="Email"
            fullWidth
            disabled
            flex={1}
            multiline={false}
            rows={1}
            value={email}
            setValue={setEmail}
            placeholder="Enter Email"
          />
        </DivAtom>
        <DivAtom
          style={{
            ...quoteCreateQuoteStyles.multiFieldContainer,
            flexDirection: widthHeightDynamicStyle(width, 600, 'column', 'row') as FlexDirection,
          }}
        >
          <FormControlInput
            margin={widthHeightDynamicStyle(width, 600, '0 0 1rem 0', '0 1rem 1rem 0') as string}
            label="Country"
            fullWidth
            disabled
            flex={1}
            multiline={false}
            rows={1}
            value={country}
            setValue={setCountry}
            placeholder="Enter Country"
          />
          <FormControlInput
            margin="0 0 1rem 0"
            label="City"
            fullWidth
            disabled
            flex={1}
            multiline={false}
            rows={1}
            value={city}
            setValue={setCity}
            placeholder="Enter City"
          />
        </DivAtom>
        <ParagraphAtom
          style={{
            ...quoteCreateQuoteStyles.title,
            marginBottom: '1rem',
          }}
          text="Holiday"
        />
        <TextFieldAtom
          variant="standard"
          size="medium"
          label="Holiday Type"
          value={holidayType}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setHolidayType(e.target.value)
          }
          options={holidayTypeData}
          adornmentPosition="end"
          style={{
            ...libraryStyles.textField,
            flex: 1,
            width: widthHeightDynamicStyle(width, 600, '100%', 'auto'),
            marginBottom: '1rem',
          }}
          disableUnderline={false}
          select
        />
        <DivAtom
          style={{
            ...quoteCreateQuoteStyles.multiFieldContainer,
            flexDirection: widthHeightDynamicStyle(width, 600, 'column', 'row') as FlexDirection,
          }}
        >
          <Select
            labelId="destinations-label"
            id="destinations"
            multiple
            placeholder="Destinations"
            value={destinations}
            onChange={handleDestinationsChange}
            input={<Input />}
            MenuProps={MenuProps}
            style={{
              flex: 1,
              width: widthHeightDynamicStyle(width, 600, '100%', 'auto'),
              margin: widthHeightDynamicStyle(width, 600, '0 0 1rem 0', '0 1rem 1rem 0'),
            }}
          >
            {countries.map((c, index) => (
              <MenuItem key={index} value={c.name}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
          <RadioButtonGroup
            title="Meal Plan"
            options={mealPlanOptions}
            value={mealPlan}
            radioGroupStyle={{
              ...quoteCreateQuoteStyles.radioBtnContainer,
              margin: widthHeightDynamicStyle(width, 600, 0, '0 1rem'),
            }}
            onChange={(e) => setMealPlan(e.target.value)}
          />
          <CheckboxAtom
            label="Additional Bed"
            name="additional-bed"
            checked={additionalBed}
            style={quoteCreateQuoteStyles.singleCheckbox}
            onChange={() => setAdditionalBed(!additionalBed)}
          />
        </DivAtom>
        <DivAtom
          style={{
            ...quoteCreateQuoteStyles.multiFieldContainer,
            flexDirection: 'column',
          }}
        >
          <RadioButtonGroup
            title="Date Type"
            options={dateTypeOptions}
            value={dateType}
            radioGroupStyle={{
              ...quoteCreateQuoteStyles.radioBtnContainer,
              margin: widthHeightDynamicStyle(width, 600, 0, '0 1rem'),
            }}
            onChange={(e) => changeDateType(e.target.value)}
          />
          <RenderDatePicker
            width={width}
            dateType={dateType}
            checkin={checkin}
            checkout={checkout}
            setCheckin={setCheckin}
            setCheckout={setCheckout}
          />
          {dateType === dateTypeOptions[1].value && (
            <FormControlInput
              margin="1rem 0 0 0"
              label="Nights"
              fullWidth={false}
              flex={0}
              multiline={false}
              rows={1}
              width="100px"
              value={notSpecificDays}
              setValue={setNotSpecificDays}
              placeholder="No. of Nights"
              type="number"
            />
          )}
        </DivAtom>
      </DivAtom>

      {invalidDate && (
        <DivAtom style={{ paddingLeft: '1rem' }}>
          <p
            style={{ color: 'red', textAlign: 'center' }}
          >
            {/* eslint-disable-next-line max-len */}
            Invalid Date - please make sure that the selected dates are in the future, the checkout date is ahead of the checkin date, and number of nights doesn't exceed 29
          </p>
        </DivAtom>
      )}

      <DivAtom
        style={{
          ...quoteCreateQuoteStyles.addBtnContainer,
          padding: widthHeightDynamicStyle(width, 768, '1rem', 0),
          margin: widthHeightDynamicStyle(
            width,
            768,
            0,
            quoteCreateQuoteStyles.addBtnContainer.margin,
          ),
        }}
      >
        <ButtonAtom
          size="large"
          text="Continue"
          onClick={(event) => onCreateCustomer(event)}
          disabled={title.trim() === '' || destinations.length === 0}
          style={{
            ...quoteCreateQuoteStyles.addBtn,
            width: widthHeightDynamicStyle(width, 768, '100%', '18%'),
            margin: '0 0 1rem 0',
          }}
        />
      </DivAtom>
    </>
  );
}

export default CustomerForm;
