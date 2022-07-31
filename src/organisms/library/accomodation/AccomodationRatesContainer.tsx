import { ChangeEvent, MouseEventHandler } from 'react';

import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';

import ButtonAtom from '../../../atoms/ButtonAtom';
import DivAtom from '../../../atoms/DivAtom';
import H2Atom from '../../../atoms/H2Atom';
import TextFieldAtom from '../../../atoms/TextFieldAtom';
import FormControlInput from '../../../molecules/FormControlInput';
import {
  libraryAccomodationStyles,
  libraryStyles,
  TableToolbarStyles,
} from '../../../styles';
import { widthHeightDynamicStyle } from '../../../utils/helpers';
import { AccomodationRate, DropdownOption, FlexDirection } from '../../../utils/types';
import AccomodationPriceTable from './AccomodationPriceTable';

interface AccomodationRatesContainerProps {
  rateRoomTypes: DropdownOption[];
  selectedRoomTypes: boolean[];
  width: number;
  newRateType: string;
  newRateStart: string;
  newRateEnd: string;
  newMealPlan: string;
  newSinglePrice: string;
  newDoublePrice: string;
  newTriplePrice: string;
  rateData: AccomodationRate[];
  deleteRate: ((row: AccomodationRate) => Promise<void>) | ((row: AccomodationRate) => void);
  onCreateRate: MouseEventHandler<HTMLButtonElement>;
  setNewRateType: any;
  setNewRateStart: any;
  setNewRateEnd: any;
  setNewMealPlan: any;
  setNewSinglePrice: any;
  setNewDoublePrice: any;
  setNewTriplePrice: any;
}

function AccomodationRatesContainer({
  width,
  rateRoomTypes,
  selectedRoomTypes,
  newRateType,
  newRateStart,
  newRateEnd,
  newMealPlan,
  newSinglePrice,
  newDoublePrice,
  newTriplePrice,
  setNewRateType,
  setNewRateStart,
  setNewRateEnd,
  setNewMealPlan,
  setNewSinglePrice,
  setNewDoublePrice,
  setNewTriplePrice,
  rateData,
  onCreateRate,
  deleteRate,
}: AccomodationRatesContainerProps) {
  return (
    <>
      <H2Atom style={libraryAccomodationStyles.title} text="Rates" />
      <DivAtom>
        <TextFieldAtom
          variant="standard"
          size="medium"
          label="Room Category"
          value={rateRoomTypes.filter((_, index) => selectedRoomTypes[index] === true).length > 0 ? newRateType : ''}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewRateType(e.target.value)}
          options={rateRoomTypes.filter((_, index) => selectedRoomTypes[index] === true)}
          adornmentPosition="end"
          style={{
            ...libraryStyles.textField,
            flex: 1,
            width: widthHeightDynamicStyle(width, 600, '100%', '30%'),
            margin: '0 0 1rem 0',
          }}
          disableUnderline={false}
          select
        />
      </DivAtom>
      <DivAtom
        style={{
          ...libraryAccomodationStyles.multiFieldContainer,
          flexDirection: widthHeightDynamicStyle(width, 1000, 'column', 'row') as FlexDirection,
          marginTop: '1rem',
        }}
      >
        <TextFieldAtom
          variant="standard"
          size="medium"
          label="Start Date"
          value={newRateStart}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewRateStart(e.target.value)}
          adornmentPosition="end"
          style={{
            ...libraryStyles.textField,
            flex: 1,
            width: widthHeightDynamicStyle(width, 1000, '100%', 'auto'),
            margin: widthHeightDynamicStyle(width, 1000, '0 0 1rem 0', '0 1rem 0 0'),
          }}
          disableUnderline={false}
          select={false}
          focused
          type="date"
        />
        <TextFieldAtom
          variant="standard"
          size="medium"
          label="End Date"
          value={newRateEnd}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewRateEnd(e.target.value)}
          adornmentPosition="end"
          style={{
            ...libraryStyles.textField,
            flex: 1,
            width: widthHeightDynamicStyle(width, 540, '100%', 'auto'),
            margin: widthHeightDynamicStyle(width, 1000, '0 0 1rem 0', '0 1rem 1rem 0'),
          }}
          disableUnderline={false}
          select={false}
          focused
          type="date"
        />
        <FormControlInput
          margin={widthHeightDynamicStyle(width, 1000, '0 0 1rem 0', '0 1rem 1rem 0') as string}
          flex={1}
          label="Meal Plan"
          fullWidth
          multiline={false}
          rows={1}
          value={newMealPlan}
          setValue={setNewMealPlan}
          placeholder="Enter Meal Plan"
        />
        <FormControlInput
          margin={widthHeightDynamicStyle(width, 1000, '0 0 1rem 0', '0 1rem 1rem 0') as string}
          flex={1}
          label="Single Price"
          fullWidth
          multiline={false}
          rows={1}
          value={newSinglePrice}
          setValue={setNewSinglePrice}
          placeholder="Enter Single Price"
          dollarAdornment
        />
        <FormControlInput
          margin={widthHeightDynamicStyle(width, 1000, '0 0 1rem 0', '0 1rem 1rem 0') as string}
          flex={1}
          label="Double Price"
          fullWidth
          multiline={false}
          rows={1}
          value={newDoublePrice}
          setValue={setNewDoublePrice}
          placeholder="Enter Double Price"
          dollarAdornment
        />
        <FormControlInput
          margin="0 0 1rem 0"
          flex={1}
          label="Triple Price"
          fullWidth
          multiline={false}
          rows={1}
          value={newTriplePrice}
          setValue={setNewTriplePrice}
          placeholder="Enter Triple Price"
          dollarAdornment
        />
        <ButtonAtom
          startIcon={<AddCircleOutlineOutlinedIcon />}
          text={widthHeightDynamicStyle(width, 1000, 'Add Rate', 'Add') as string}
          disabled={
            newRateStart === ''
            || newRateEnd === ''
            || newMealPlan === ''
            || newSinglePrice === ''
            || newDoublePrice === ''
            || newTriplePrice === ''
          }
          onClick={(event) => onCreateRate(event)}
          style={{
            ...TableToolbarStyles.addBtn,
            width: widthHeightDynamicStyle(width, 540, '100%', 'auto'),
            height: '3rem',
            marginLeft: widthHeightDynamicStyle(width, 1000, 0, '1rem') as string,
            marginBottom: widthHeightDynamicStyle(width, 1000, '1rem', 0) as string,
          }}
          size="large"
        />
      </DivAtom>
      <DivAtom>
        {rateData.length > 0 && (
          <AccomodationPriceTable
            columns={[
              'ROOM TYPE',
              'START DATE',
              'END DATE',
              'MEAL PLAN',
              'SINGLE',
              'DOUBLE',
              'TRIPLE',
              '',
            ]}
            data={rateData}
            deleteRate={deleteRate}
          />
        )}
      </DivAtom>
    </>
  );
}

export default AccomodationRatesContainer;
