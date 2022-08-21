import { ReactNode, CSSProperties, ChangeEvent } from 'react';

import { InputAdornment, MenuItem, TextField } from '@material-ui/core';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';

interface DropdownOption {
  label: string;
  value: string;
}

interface TextFieldAtomProps {
  variant: 'filled' | 'standard';
  value: string;
  label: string;
  select: boolean;
  size: 'small' | 'medium';
  adornmentPosition: 'start' | 'end';
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  helperText?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  disableUnderline?: boolean;
  focused?: boolean;
  error?: boolean;
  options?: DropdownOption[];
  children?: ReactNode;
  style?: CSSProperties;
}

function TextFieldAtom({
  variant,
  size,
  adornmentPosition,
  label,
  required,
  disabled,
  disableUnderline,
  focused,
  select,
  error,
  helperText,
  type,
  placeholder,
  value,
  onChange,
  options,
  style,
  ...props
}: TextFieldAtomProps) {
  const removeBgSelect = disableUnderline === false ? 'true' : 'false';
  const removeBgTextField = type === 'date' || type === 'month' ? 'true' : 'false';

  const inputProps = adornmentPosition === 'start'
    ? {
      startAdornment: (
        <InputAdornment position={adornmentPosition}>
          {props.children}
        </InputAdornment>
      ),
      disableUnderline: type !== 'date' && type !== 'month',
    }
    : {
      endAdornment: (
        <InputAdornment position={adornmentPosition}>
          {props.children}
        </InputAdornment>
      ),
      disableUnderline: type !== 'date' && type !== 'month',
    };

  return !select ? (
    <StyledTextFieldAtom
      value={value}
      style={style}
      onChange={onChange}
      variant={variant}
      size={size}
      label={label}
      type={type}
      required={required}
      disabled={disabled}
      focused={focused}
      error={error}
      helperText={helperText}
      placeholder={placeholder}
      removebg={removeBgTextField}
      InputProps={inputProps}
    />
  ) : (
    <StyledTextFieldAtom
      select
      style={style}
      value={value}
      onChange={onChange}
      disabled={disabled}
      variant={variant}
      size={size}
      label={label}
      InputProps={{ disableUnderline: disableUnderline !== false }}
      removebg={removeBgSelect}
    >
      {options!.map((option: DropdownOption) => (
        <MenuItem value={option.value} key={uuid()}>
          {option.label}
        </MenuItem>
      ))}
    </StyledTextFieldAtom>
  );
}

export default TextFieldAtom;

interface StyleProps {
  removebg?: string;
}

const StyledTextFieldAtom = styled(TextField) <StyleProps>`
  .MuiInputBase-root {
    border-radius: 0.5rem;
    border-bottom: 0px;
    background-color: #dae1ec;
  }

  ${({ removebg }) => removebg === 'true' && inputBaseStyle}

  .MuiSelect-root {
    padding: 11px;
  }
`;

const inputBaseStyle = `
  .MuiInputBase-root {
    background-color: transparent;
  }
  .MuiSelect-root {
    padding: 6px 0px 7px !important;
  }
`;
