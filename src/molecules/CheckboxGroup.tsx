import { ChangeEvent, CSSProperties } from 'react';

import {
  createStyles,
  FormControl,
  FormGroup,
  FormLabel,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { v4 as uuid } from 'uuid';

import CheckboxAtom from '../atoms/CheckboxAtom';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
  },
  formControl: {
    marginLeft: theme.spacing(3),
  },
}));

interface CheckboxGroupProps {
  groupTitle: string;
  labels: string[];
  names: string[];
  checked: boolean[];
  onChange: ((event: ChangeEvent<HTMLInputElement>, index: number) => void);
  style: CSSProperties;
}

function CheckboxGroup({
  groupTitle,
  labels,
  names,
  checked,
  onChange,
  style,
}: CheckboxGroupProps) {
  const classes = useStyles();

  return (
    <FormControl component="fieldset" className={classes.formControl}>
      <FormLabel component="legend">{groupTitle}</FormLabel>
      <FormGroup style={style} className={classes.root}>
        {labels.map((lb, index) => (
          <CheckboxAtom
            key={uuid()}
            label={lb}
            name={names[index]}
            onChange={(event) => onChange(event, index)}
            checked={checked[index]}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
}

export default CheckboxGroup;
