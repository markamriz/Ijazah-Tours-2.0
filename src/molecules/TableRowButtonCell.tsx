import { MouseEventHandler } from 'react';

import { CircularProgress, TableCell } from '@material-ui/core';

import ButtonAtom from '../atoms/ButtonAtom';
import { CustomerQuoteStatus } from '../utils/types';

interface TableRowButtonCellProps {
  btnWidth: string;
  btnBorderRadius: string;
  align: 'left' | 'center' | 'right';
  btnSize: 'small' | 'medium';
  onClick: MouseEventHandler<HTMLButtonElement>;
  btnDisabled?: boolean;
  loading?: boolean;
  btnText?: string;
  btnColors?: string[];
  cell?: { status: CustomerQuoteStatus };
}

function TableRowButtonCell({
  onClick,
  align,
  btnSize,
  btnWidth,
  btnBorderRadius,
  btnDisabled,
  loading,
  cell,
  btnText,
  btnColors,
}: TableRowButtonCellProps) {
  let backgroundColor;
  let color;
  if (btnColors) {
    [backgroundColor, color] = btnColors;
  } else if (cell!.status === 'APPROVED') {
    backgroundColor = '#41E93E';
    color = '#146521';
  } else if (cell!.status === 'COMPLETE') {
    backgroundColor = '#7595EC';
    color = '#0847A5';
  } else if (cell!.status === 'SHARED') {
    backgroundColor = '#dce223';
    color = '#0a0f16';
  } else {
    backgroundColor = '#C1BFBF';
    color = '#464E5F';
  }

  return (
    <TableCell align={align}>
      <ButtonAtom
        style={{
          width: btnWidth,
          borderRadius: btnBorderRadius,
          backgroundColor,
          color,
        }}
        size={btnSize}
        onClick={onClick}
        endIcon={loading && <CircularProgress size={20} color="inherit" />}
        text={btnText || cell!.status}
        disabled={btnDisabled}
      />
    </TableCell>
  );
}

export default TableRowButtonCell;
