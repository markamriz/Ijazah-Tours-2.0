import { ChangeEvent } from 'react';

import DivAtom from '../../../atoms/DivAtom';
import InputAtom from '../../../atoms/InputAtom';
import { libraryStyles } from '../../../styles';
import { dateTypeOptions, widthHeightDynamicStyle } from '../../../utils/helpers';

interface RenderDatePickerProps {
  width: number;
  dateType: string;
  checkin: string;
  checkout: string;
  setCheckin: any;
  setCheckout: any;
}

export const RenderDatePicker = ({
  width,
  dateType,
  checkin,
  checkout,
  setCheckin,
  setCheckout,
}: RenderDatePickerProps) => (
  dateType === dateTypeOptions[0].value ? (
    <DivAtom>
      <InputAtom
        fullWidth={false}
        value={checkin}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setCheckin(e.target.value)}
        adornmentPosition="end"
        style={{
          ...libraryStyles.textField,
          flex: 1,
          width: widthHeightDynamicStyle(width, 600, '100%', 'auto'),
          margin: widthHeightDynamicStyle(width, 600, '0 0 1rem 0', '0 1rem 0 0'),
        }}
        type="date"
        minValue={new Date().toISOString().split('T')[0]}
      />
      <InputAtom
        fullWidth={false}
        value={checkout}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setCheckout(e.target.value)}
        adornmentPosition="end"
        style={{
          ...libraryStyles.textField,
          flex: 1,
          width: widthHeightDynamicStyle(width, 600, '100%', 'auto'),
        }}
        type="date"
        minValue={new Date().toISOString().split('T')[0]}
      />
    </DivAtom>
  ) : (
    <DivAtom>
      <InputAtom
        fullWidth={false}
        value={checkin}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setCheckin(e.target.value)}
        adornmentPosition="end"
        style={{
          ...libraryStyles.textField,
          flex: 1,
          width: widthHeightDynamicStyle(width, 600, '100%', 'auto'),
          margin: widthHeightDynamicStyle(width, 600, '0 0 1rem 0', '0 1rem 0 0'),
        }}
        type="month"
        minValue={new Date().toISOString().split('T')[0]}
      />
      <InputAtom
        fullWidth={false}
        value={checkout}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setCheckout(e.target.value)}
        adornmentPosition="end"
        style={{
          ...libraryStyles.textField,
          flex: 1,
          width: widthHeightDynamicStyle(width, 600, '100%', 'auto'),
        }}
        type="month"
        minValue={new Date().toISOString().split('T')[0]}
      />
    </DivAtom>
  )
);
