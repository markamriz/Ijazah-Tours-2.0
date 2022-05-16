import { ReactNode } from 'react';

import { TableCell } from '@material-ui/core';
import { v4 as uuid } from 'uuid';

import { Order } from '../utils/types';

interface TableColumnCellProps {
  color: string;
  column?: string;
  greenBorder?: boolean;
  align?: 'left' | 'center' | 'right' | 'justify' | 'inherit';
  sortDirection?: Order | false;
  children?: ReactNode;
}

function TableColumnCell({
  column,
  greenBorder,
  align,
  color,
  sortDirection,
  ...props
}: TableColumnCellProps) {
  let cellStyle = {};
  if (greenBorder) {
    cellStyle = {
      color,
      fontWeight: 'bold',
      borderBottom: '1px solid #41E93E',
    };
  } else if (props.children) {
    cellStyle = { color, fontWeight: 'bold' };
  }

  return (
    <TableCell
      sortDirection={sortDirection}
      key={uuid()}
      color={color}
      align={align}
      style={cellStyle}
    >
      {!props.children ? (
        <strong style={{ color }} key={uuid()}>{column}</strong>
      ) : (
        props.children
      )}
    </TableCell>
  );
}

export default TableColumnCell;
