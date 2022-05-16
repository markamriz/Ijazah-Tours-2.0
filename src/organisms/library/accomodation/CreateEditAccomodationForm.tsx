import { ChangeEvent, MouseEvent } from 'react';

import {
  CircularProgress,
  FormControl,
  InputLabel,
} from '@material-ui/core';
import { v4 as uuid } from 'uuid';

import ButtonAtom from '../../../atoms/ButtonAtom';
import DivAtom from '../../../atoms/DivAtom';
import InputAtom from '../../../atoms/InputAtom';
import ParagraphAtom from '../../../atoms/ParagraphAtom';
import PhoneInputAtom from '../../../atoms/PhoneInputAtom';
import TextFieldAtom from '../../../atoms/TextFieldAtom';
import CheckboxGroup from '../../../molecules/CheckboxGroup';
import FormControlInput from '../../../molecules/FormControlInput';
import { libraryAccomodationStyles, libraryStyles } from '../../../styles';
import { widthHeightDynamicStyle } from '../../../utils/helpers';
import {
  AccomodationRate,
  LocationDropdown,
  CityDropdown,
  DropdownOption,
  FlexDirection,
  SettingsRoomProperties,
} from '../../../utils/types';
import AccomodationRatesContainer from './AccomodationRatesContainer';

interface CreateEditAccomodationFormProps {
  accomodationTypeData: DropdownOption[];
  rateRoomTypes: DropdownOption[];
  accomodationLocations: LocationDropdown[];
  accomodationCities: CityDropdown[];
  accomodationFilteredCities: CityDropdown[];
  rateData: AccomodationRate[];
  allRoomTypes: SettingsRoomProperties[];
  allRoomViews: SettingsRoomProperties[];
  allRoomGradings: SettingsRoomProperties[];
  width: number;
  showValidationErrorMessage: boolean;
  btnText: string;
  accomodationType: string;
  location: string;
  city: string;
  group: string;
  name: string;
  contactNumber: string;
  email: string;
  webLink: string;
  ijazahLink: string;
  additionalBedPrice: string;
  newRateType: string;
  newRatePrice: string;
  newRateStart: string;
  newRateEnd: string;
  newMealPlan: string;
  newSinglePrice: string;
  newDoublePrice: string;
  newTriplePrice: string;
  isCreating: boolean;
  selectedTypes: string[];
  roomCategories: boolean[];
  roomViews: boolean[];
  roomGradings: boolean[];
  selectedTypeValues: { [k: string]: string };
  addRoomCategory: (i: number) => void;
  addRoomView: (i: number) => void;
  addRoomGradings: (i: number) => void;
  onSetSelectedTypeValue: (type: string, val: string) => void;
  onCreateRate: (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
  deleteRate: ((row: AccomodationRate) => Promise<void>) | ((row: AccomodationRate) => void);
  onAddEditAccomodation: () => Promise<void>;
  setAccomodationType: any;
  setAccomodationFilteredCities: any;
  setLocation: any;
  setCity: any;
  setGroup: any;
  setName: any;
  setContactNumber: any;
  setEmail: any;
  setWebLink: any;
  setIjazahLink: any;
  setAdditionalBedPrice: any;
  setNewRateType: any;
  setNewRatePrice: any;
  setNewRateStart: any,
  setNewRateEnd: any,
  setNewMealPlan: any,
  setNewSinglePrice: any,
  setNewDoublePrice: any,
  setNewTriplePrice: any,
}

function CreateEditAccomodationForm({
  accomodationTypeData,
  rateRoomTypes,
  accomodationLocations,
  accomodationCities,
  accomodationFilteredCities,
  rateData,
  allRoomTypes,
  allRoomViews,
  allRoomGradings,
  width,
  btnText,
  accomodationType,
  showValidationErrorMessage,
  location,
  city,
  group,
  name,
  contactNumber,
  email,
  webLink,
  ijazahLink,
  additionalBedPrice,
  newRateType,
  newRatePrice,
  newRateStart,
  newRateEnd,
  newMealPlan,
  newSinglePrice,
  newDoublePrice,
  newTriplePrice,
  isCreating,
  selectedTypes,
  roomCategories,
  roomViews,
  roomGradings,
  selectedTypeValues,
  addRoomCategory,
  addRoomView,
  addRoomGradings,
  onSetSelectedTypeValue,
  onCreateRate,
  onAddEditAccomodation,
  deleteRate,
  setAccomodationType,
  setAccomodationFilteredCities,
  setLocation,
  setCity,
  setGroup,
  setName,
  setContactNumber,
  setEmail,
  setWebLink,
  setIjazahLink,
  setAdditionalBedPrice,
  setNewRateType,
  setNewRatePrice,
  setNewRateStart,
  setNewRateEnd,
  setNewMealPlan,
  setNewSinglePrice,
  setNewDoublePrice,
  setNewTriplePrice,
}: CreateEditAccomodationFormProps) {
  return (
    <>
      <DivAtom style={libraryAccomodationStyles.formContainer}>
        <DivAtom
          style={{
            ...libraryAccomodationStyles.multiFieldContainer,
            flexDirection: widthHeightDynamicStyle(width, 600, 'column', 'row') as FlexDirection,
          }}
        >
          <TextFieldAtom
            variant="standard"
            size="medium"
            label="Accomodation Type"
            value={accomodationType}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setAccomodationType(e.target.value)}
            options={accomodationTypeData}
            adornmentPosition="end"
            style={{
              ...libraryStyles.textField,
              flex: 1,
              width: widthHeightDynamicStyle(width, 600, '100%', 'auto'),
              margin: widthHeightDynamicStyle(width, 600, '0 0 1rem 0', '0 1rem 1rem 0'),
            }}
            disableUnderline={false}
            select
          />
          <TextFieldAtom
            variant="standard"
            size="medium"
            label="Location"
            value={location}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
              setLocation(e.target.value);
              setCity('');
              const locationValue = accomodationLocations.find((l) => (
                l.value === e.target.value
              ))?.value;

              const cities = accomodationCities.filter((c) => c.countryName === locationValue);
              setAccomodationFilteredCities(cities);
            }}
            options={accomodationLocations}
            adornmentPosition="end"
            style={{
              ...libraryStyles.textField,
              flex: 1,
              width: widthHeightDynamicStyle(width, 600, '100%', 'auto'),
              margin: widthHeightDynamicStyle(width, 600, '0 0 1rem 0', '0 1rem 1rem 0') as string,
            }}
            disableUnderline={false}
            select
          />
          <TextFieldAtom
            variant="standard"
            size="medium"
            label="City"
            value={city}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCity(e.target.value)}
            options={accomodationFilteredCities}
            adornmentPosition="end"
            style={{
              ...libraryStyles.textField,
              flex: 1,
              width: widthHeightDynamicStyle(width, 600, '100%', 'auto'),
              margin: '0 0 1rem 0',
            }}
            disableUnderline={false}
            select
          />
        </DivAtom>
        <DivAtom
          style={{
            ...libraryAccomodationStyles.multiFieldContainer,
            flexDirection: widthHeightDynamicStyle(width, 600, 'column', 'row') as FlexDirection,
          }}
        >
          <FormControlInput
            margin={widthHeightDynamicStyle(width, 600, '0 0 1rem 0', '0 1rem 1rem 0') as string}
            flex={1}
            label="Group"
            fullWidth
            multiline={false}
            rows={1}
            value={group}
            setValue={setGroup}
            placeholder="Enter Group"
          />
          <FormControlInput
            margin="0 0 1rem 0"
            flex={1}
            label="Name"
            fullWidth
            multiline={false}
            rows={1}
            value={name}
            setValue={setName}
            placeholder="Enter Name"
          />
        </DivAtom>
        <DivAtom
          style={{
            ...libraryAccomodationStyles.multiFieldContainer,
            flexDirection: widthHeightDynamicStyle(width, 600, 'column', 'row') as FlexDirection,
          }}
        >
          <PhoneInputAtom
            value={contactNumber}
            setContactNumber={setContactNumber}
            style={{ margin: widthHeightDynamicStyle(width, 600, '0 0 1rem 0', '0 1rem 0rem 0') as string }}
          />
          <FormControlInput
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
            ...libraryAccomodationStyles.multiFieldContainer,
            flexDirection: widthHeightDynamicStyle(width, 600, 'column', 'row') as FlexDirection,
          }}
        >
          <FormControlInput
            margin={widthHeightDynamicStyle(width, 600, '0 0 1rem 0', '0 1rem 1rem 0') as string}
            flex={1}
            label="Web Link"
            fullWidth
            multiline={false}
            rows={1}
            value={webLink}
            setValue={setWebLink}
            placeholder="Enter Web Link"
          />
          <FormControlInput
            margin="0 0 1rem 0"
            flex={1}
            label="Ijazah Link"
            fullWidth
            multiline={false}
            rows={1}
            value={ijazahLink}
            setValue={setIjazahLink}
            placeholder="Enter Ijazah Link"
          />
        </DivAtom>

        <DivAtom
          style={{
            ...libraryAccomodationStyles.multiFieldContainer,
            flexDirection: widthHeightDynamicStyle(width, 600, 'column', 'row') as FlexDirection,
            justifyContent: 'flex-start',
            marginTop: '0.8rem',
          }}
        >
          <CheckboxGroup
            groupTitle="Room Categories"
            labels={allRoomTypes.map((type) => type.val)}
            names={allRoomTypes.map((type) => type.val)}
            checked={roomCategories}
            onChange={(_, i: number) => addRoomCategory(i)}
            style={{ flexDirection: 'column', marginBottom: '1rem' }}
          />
          <CheckboxGroup
            groupTitle="Room View"
            labels={allRoomViews.map((type) => type.val)}
            names={allRoomViews.map((type) => type.val)}
            checked={roomViews}
            onChange={(_, i: number) => addRoomView(i)}
            style={{ flexDirection: 'column', marginBottom: '1rem' }}
          />
          <CheckboxGroup
            groupTitle="Gradings"
            labels={allRoomGradings.map((type) => type.val)}
            names={allRoomGradings.map((type) => type.val)}
            checked={roomGradings}
            onChange={(_, i: number) => addRoomGradings(i)}
            style={{
              flexDirection: 'column',
            }}
          />
        </DivAtom>

        <AccomodationRatesContainer
          width={width}
          rateRoomTypes={rateRoomTypes}
          selectedRoomTypes={roomCategories}
          deleteRate={deleteRate}
          newRateType={newRateType}
          newRateStart={newRateStart}
          newRatePrice={newRatePrice}
          newRateEnd={newRateEnd}
          newMealPlan={newMealPlan}
          newSinglePrice={newSinglePrice}
          newDoublePrice={newDoublePrice}
          newTriplePrice={newTriplePrice}
          setNewRateType={setNewRateType}
          setNewRatePrice={setNewRatePrice}
          setNewRateStart={setNewRateStart}
          setNewRateEnd={setNewRateEnd}
          setNewMealPlan={setNewMealPlan}
          setNewSinglePrice={setNewSinglePrice}
          setNewDoublePrice={setNewDoublePrice}
          setNewTriplePrice={setNewTriplePrice}
          rateData={rateData}
          onCreateRate={onCreateRate}
        />

        {selectedTypes[0] && selectedTypes.map((type, index) => (
          !(rateData.find((r) => r.newRateType === type))
        ) && (
          <DivAtom
            key={index}
            style={{
              ...libraryAccomodationStyles.multiFieldContainer,
              flexDirection: widthHeightDynamicStyle(width, 600, 'column', 'row') as FlexDirection,
              justifyContent: 'flex-start',
              marginTop: '0.8rem',
            }}
          >
            <ParagraphAtom style={{ width: '150px' }} text={type} />
            <FormControl style={{ margin: '0 0 1rem 1rem' }}>
              <InputLabel>Price</InputLabel>
              <InputAtom
                plain="true"
                fullWidth
                multiline={false}
                rows={1}
                value={selectedTypes.length > 0 ? selectedTypeValues[type] : ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => (
                  onSetSelectedTypeValue(type, e.target.value)
                )}
                placeholder="Enter Price"
                dollarAdornment
              />
            </FormControl>
          </DivAtom>
        ))}

        <DivAtom
          style={{
            ...libraryAccomodationStyles.multiFieldContainer,
            flexDirection: widthHeightDynamicStyle(width, 600, 'column', 'row') as FlexDirection,
            justifyContent: 'flex-start',
            marginTop: '0.8rem',
          }}
        >
          <ParagraphAtom style={{ width: '150px' }} text="Additional Bed" />
          <FormControl style={{ margin: '0 0 1rem 1rem' }}>
            <InputLabel>Additional Bed</InputLabel>
            <InputAtom
              plain="true"
              fullWidth
              multiline={false}
              rows={1}
              value={additionalBedPrice}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setAdditionalBedPrice(e.target.value)}
              placeholder="Enter Additional Bed Price"
              dollarAdornment
            />
          </FormControl>
        </DivAtom>
      </DivAtom>

      {showValidationErrorMessage && (
        <ParagraphAtom
          text="Please fill in all the required fields"
          style={libraryAccomodationStyles.errorMsg}
        />
      )}

      <DivAtom
        style={{
          ...libraryAccomodationStyles.addBtnContainer,
          padding: widthHeightDynamicStyle(width, 768, '1rem', 0),
          margin: widthHeightDynamicStyle(
            width,
            768,
            0,
            libraryAccomodationStyles.addBtnContainer.margin,
          ),
        }}
      >
        <ButtonAtom
          endIcon={isCreating && <CircularProgress size={20} color="inherit" />}
          size="large"
          disabled={isCreating}
          text={btnText}
          onClick={onAddEditAccomodation}
          style={{
            ...libraryAccomodationStyles.addBtn,
            width: widthHeightDynamicStyle(width, 768, '100%', '18%'),
            margin: widthHeightDynamicStyle(width, 768, '0 0 1rem 0', 0),
          }}
        />
      </DivAtom>

    </>
  );
}

export default CreateEditAccomodationForm;
