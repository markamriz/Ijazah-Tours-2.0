import { ChangeEvent, MouseEvent } from 'react';

import {
  Checkbox,
  TableCell,
  TableHead as TH,
  TableRow,
  TableSortLabel,
} from '@material-ui/core';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';

import TableColumnCell from './TableColumnCell';
import { Order, LibraryHeadCell, QuoteHeadCell } from '../utils/types';

interface TableHeadProps {
  orderBy: string;
  numSelected: number;
  rowCount: number;
  classes: ClassNameMap<'root' | 'table' | 'paper' | 'visuallyHidden'>;
  headCells: LibraryHeadCell[] | QuoteHeadCell[];
  onRequestSort: (event: MouseEvent<HTMLSpanElement>, property: string) => void;
  order: Order;
  onSelectAllClick?: (
    event: ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void;
}

function TableHead({
  classes,
  headCells,
  onSelectAllClick,
  order,
  orderBy,
  numSelected,
  rowCount,
  onRequestSort,
}: TableHeadProps) {
  const createSortHandler = (property: string) => (event: MouseEvent<HTMLSpanElement>) => {
    onRequestSort(event, property);
  };

  const spanOrderText = order === 'desc' ? 'sorted descending' : 'sorted ascending';

  return (
    <TH>
      <TableRow>
        {onSelectAllClick && (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
        )}
        {headCells.map((headCell: LibraryHeadCell) => (
          <TableColumnCell
            color="black"
            key={headCell.id}
            align="left"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>{spanOrderText}</span>
              ) : null}
            </TableSortLabel>
          </TableColumnCell>
        ))}
      </TableRow>
    </TH>
  );
}

export default TableHead;
