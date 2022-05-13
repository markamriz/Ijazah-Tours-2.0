import { TableCell } from '@material-ui/core';
import { v4 as uuid } from 'uuid';

import AnchorAtom from '../atoms/AnchorAtom';
import ParagraphAtom from '../atoms/ParagraphAtom';
import { tableRowTextCellStyles } from '../styles';

interface TableRowTextCellProps {
  cell: {
    title: string | number;
    weight: number;
    colors: string[];
    align: 'left' | 'center' | 'right';
    subtitle?: string;
    markTitle?: boolean;
    isLink?: boolean;
  };
}

function TableRowTextCell({ cell }: TableRowTextCellProps) {
  let cellData;
  if (cell.isLink) {
    cellData = (
      <TableCell align={cell.align}>
        <AnchorAtom
          title={cell.title as string}
          href={cell.title as string}
          style={{ textDecoration: 'underline' }}
        />
      </TableCell>
    );
  } else if (cell.subtitle) {
    cellData = (
      <TableCell align={cell.align}>
        <ParagraphAtom
          text={cell.title}
          key={uuid()}
          style={{
            ...tableRowTextCellStyles.paragraph,
            fontWeight: cell.weight,
            color: cell.colors[0],
          }}
        />
        <ParagraphAtom
          text={cell.subtitle}
          key={uuid()}
          style={{
            ...tableRowTextCellStyles.paragraph,
            color: cell.colors[0],
          }}
        />
      </TableCell>
    );
  } else if (cell.markTitle) {
    cellData = (
      <TableCell align={cell.align}>
        <ParagraphAtom
          text={cell.title}
          key={uuid()}
          style={{
            ...tableRowTextCellStyles.paragraph,
            fontWeight: cell.weight,
            color: cell.colors[0],
          }}
          markStyle={{
            border:
              cell.title === 'ACTIVE' ? '1px solid #0A65FF' : '1px solid #B5B5C3',
            borderRadius: '11px',
            backgroundColor: cell.title === 'ACTIVE' ? '#0A65FF' : 'transparent',
            padding: '0.4rem',
            color: cell.title === 'ACTIVE' ? 'white' : '#B5B5C3',
          }}
          mark
        />
      </TableCell>
    );
  } else {
    cellData = (
      <TableCell align={cell.align}>
        <ParagraphAtom
          text={cell.title}
          key={uuid()}
          style={{
            ...tableRowTextCellStyles.paragraph,
            fontWeight: cell.weight,
            color: cell.colors[0],
          }}
        />
      </TableCell>
    );
  }

  return cellData;
}

export default TableRowTextCell;
