import { ChangeEvent, CSSProperties } from 'react';

import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import { v4 as uuid } from 'uuid';

import { RadioButtonOption } from '../utils/types';

interface RadioButtonGroupProps {
  options: RadioButtonOption[];
  value: string;
  title: string;
  onChange: (event: ChangeEvent<HTMLInputElement>, value: string) => void;
  radioGroupStyle?: CSSProperties;
}

function RadioButtonGroup({
  options,
  value,
  title,
  radioGroupStyle,
  onChange,
}: RadioButtonGroupProps) {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{title}</FormLabel>
      <RadioGroup
        aria-label={title}
        name={title}
        value={value}
        onChange={onChange}
        style={radioGroupStyle}
      >
        {options.map((option) => (
          <FormControlLabel
            key={uuid()}
            value={option.value}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}

export default RadioButtonGroup;
