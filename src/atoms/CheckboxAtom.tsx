import { ChangeEvent, CSSProperties } from 'react';

import {
  Checkbox,
  FormControlLabel,
  withStyles,
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import styled from 'styled-components';

const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})((props: any) => <Checkbox color="default" {...props} />);

interface CheckboxAtomProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: ((event: ChangeEvent<HTMLInputElement>, index: number) => void);
  style?: CSSProperties;
}

function CheckboxAtom({
  label,
  name,
  checked,
  style,
  onChange,
}: CheckboxAtomProps) {
  return (
    <StyledFormControlLabel
      style={style}
      control={
        <GreenCheckbox
          checked={checked}
          onChange={onChange}
          name={name}
        />
      }
      label={label}
    />
  );
}

export default CheckboxAtom;

const StyledFormControlLabel = styled(FormControlLabel)`
  color: rgba(0, 0, 0, 0.54) !important;
`;
