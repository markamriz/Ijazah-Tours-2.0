import { ChangeEvent } from 'react';

import { Checkbox, TableCell } from '@material-ui/core';
import { v4 as uuid } from 'uuid';

import ParagraphAtom from '../atoms/ParagraphAtom';
import { tableRowCheckboxCellStyles, tableRowTextCellStyles } from '../styles';

interface TableRowCheckboxCellProps {
  name: string;
  checked: boolean;
  align: 'left' | 'center' | 'right';
  onChange: ((event: ChangeEvent<HTMLInputElement>, checked: boolean) => void);
}

function TableRowCheckboxCell({
  onChange,
  name,
  checked,
  align,
}: TableRowCheckboxCellProps) {
  return (
    <TableCell align={align} style={tableRowCheckboxCellStyles}>
      <Checkbox
        checked={checked}
        onChange={onChange}
      />
      <ParagraphAtom
        text={name}
        key={uuid()}
        style={{
          ...tableRowTextCellStyles.paragraph,
        }}
      />
    </TableCell>
  );
}

export default TableRowCheckboxCell;
