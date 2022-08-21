import { FormControl, TableCell } from '@material-ui/core';

import InputAtom from '../atoms/InputAtom';
import TextFieldAtom from '../atoms/TextFieldAtom';
import { libraryStyles } from '../styles';

interface TableRowEditCellProps {
  value: string;
  select: boolean;
  align: 'left' | 'center' | 'right';
  inputTextField?: boolean;
  disabled?: boolean;
  lkrAdornment?: boolean;
  dollarAdornment?: boolean;
  type?: string;
  options?: any;
  onSelectChange?: (val: string, type: string) => void;
  onChange?: (val: string) => void;
  onCountChange?: (val: string) => void;
}

function TableRowEditCell({
  value,
  type,
  select,
  options,
  align,
  inputTextField,
  disabled,
  lkrAdornment,
  dollarAdornment,
  onSelectChange,
  onChange,
  onCountChange,
}: TableRowEditCellProps) {
  return select ? (
    <TableCell align={align}>
      <TextFieldAtom
        variant="standard"
        size="medium"
        label=""
        value={value}
        onChange={(e) => onSelectChange && type && onSelectChange(e.target.value, type)!}
        options={options}
        adornmentPosition="end"
        style={{
          ...libraryStyles.textField,
          flex: 1,
        }}
        disableUnderline={false}
        disabled={disabled}
        select
      />
    </TableCell>
  ) : (
    <TableCell align={align}>
      <FormControl>
        <InputAtom
          plain="true"
          fullWidth
          multiline={false}
          rows={1}
          value={value}
          type={inputTextField ? 'text' : 'number'}
          onChange={(e) => (
            (onCountChange && onCountChange(e.target.value))
            || (onChange && onChange(e.target.value))
          )}
          placeholder=""
          minValue={1}
          lkrAdornment={lkrAdornment}
          dollarAdornment={dollarAdornment}
          disabled={disabled}
        />
      </FormControl>
    </TableCell>
  );
}

export default TableRowEditCell;
