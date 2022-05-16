import {
  ReactNode,
  CSSProperties,
  ChangeEvent,
  FocusEventHandler,
  RefObject,
} from 'react';

import { Input, InputAdornment } from '@material-ui/core';
import styled from 'styled-components';

interface InputAtomProps {
  value: string | number;
  fullWidth: boolean;
  plain?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  dollarAdornment?: boolean;
  lkrAdornment?: boolean;
  error?: boolean;
  rows?: number;
  minValue?: number | string;
  adornmentPosition?: 'start' | 'end';
  ref?: ((instance: unknown) => void) | RefObject<unknown>;
  children?: ReactNode;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: FocusEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  style?: CSSProperties;
}

function InputAtom({
  adornmentPosition,
  plain,
  type,
  required,
  disabled,
  multiline,
  dollarAdornment,
  lkrAdornment,
  rows,
  minValue,
  error,
  placeholder,
  fullWidth,
  value,
  onChange,
  onBlur,
  onFocus,
  style,
  ...props
}: InputAtomProps) {
  let adornment = <></>;
  if (dollarAdornment) {
    adornment = <InputAdornment position="start">$</InputAdornment>;
  } else if (lkrAdornment) {
    adornment = <InputAdornment position="start">LKR</InputAdornment>;
  } else if (adornmentPosition) {
    adornment = <InputAdornment position="start">{props.children}</InputAdornment>;
  }

  return (
    <StyledInput
      multiline={multiline}
      rows={rows}
      plain={plain}
      type={type}
      style={{ ...style, color: 'black' }}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      required={required}
      disabled={disabled}
      error={error}
      placeholder={placeholder}
      fullWidth={fullWidth}
      disableUnderline={plain === 'false'}
      startAdornment={adornment}
      inputProps={{
        min: minValue || 0,
      }}
    />
  );
}

export default InputAtom;

const StyledInput = styled(Input) <InputAtomProps>`
  ${({ plain }) => plain === 'false' && inputBaseStyle}
`;

const inputBaseStyle = `
  &.MuiInputBase-root {
    border-bottom: 0px;
    border-radius: 0.5rem;
    background-color: #dae1ec;
  }

  .MuiInputAdornment-root {
    color: #6f809e !important;
    margin-left: 8px;
  }
`;
