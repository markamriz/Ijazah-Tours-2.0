import {
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';

import TableColumnCell from '../../../molecules/TableColumnCell';
import TableRowIconCell from '../../../molecules/TableRowIconCell';
import TableRowTextCell from '../../../molecules/TableRowTextCell';
import { AccomodationRate } from '../../../utils/types';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    overflow: 'scroll',
  },
});

interface AccomodationPriceTableProps {
  data: AccomodationRate[];
  columns: string[];
  deleteRate: ((row: AccomodationRate) => Promise<void>) | ((row: AccomodationRate) => void);
}

function AccomodationPriceTable({
  data,
  columns,
  deleteRate,
}: AccomodationPriceTableProps) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="accomodations price table">
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableColumnCell
                key={index}
                align="center"
                color="b5b5c3"
                column={column}
              />
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row: AccomodationRate, index) => (
            <TableRow key={index}>
              <TableRowTextCell
                cell={{
                  align: 'center',
                  title: row.newRateType,
                  colors: ['#464E5F', '#B5B5C3'],
                  weight: 400,
                }}
              />
              <TableRowTextCell
                cell={{
                  align: 'center',
                  title: row.newRateStart,
                  colors: ['#464E5F', '#B5B5C3'],
                  weight: 400,
                }}
              />
              <TableRowTextCell
                cell={{
                  align: 'center',
                  title: row.newRateEnd,
                  colors: ['#464E5F', '#B5B5C3'],
                  weight: 400,
                }}
              />
              <TableRowTextCell
                cell={{
                  align: 'center',
                  title: row.newMealPlan,
                  colors: ['#464E5F', '#B5B5C3'],
                  weight: 400,
                }}
              />
              <TableRowTextCell
                cell={{
                  align: 'center',
                  title: row.newSinglePrice,
                  colors: ['#464E5F', '#B5B5C3'],
                  weight: 400,
                }}
              />
              <TableRowTextCell
                cell={{
                  align: 'center',
                  title: row.newDoublePrice,
                  colors: ['#464E5F', '#B5B5C3'],
                  weight: 400,
                }}
              />
              <TableRowTextCell
                cell={{
                  align: 'center',
                  title: row.newTriplePrice,
                  colors: ['#464E5F', '#B5B5C3'],
                  weight: 400,
                }}
              />
              <TableRowIconCell
                align="center"
                onClick={() => deleteRate(row)}
                textColor="#B5B5C3"
                size="small"
                padding="8px"
                children={<DeleteOutlinedIcon style={{ color: 'red' }} />}
              />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default AccomodationPriceTable;
