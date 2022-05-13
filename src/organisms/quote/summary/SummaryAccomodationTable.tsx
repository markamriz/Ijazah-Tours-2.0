import {
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
} from '@material-ui/core';
import { v4 as uuid } from 'uuid';

import TableColumnCell from '../../../molecules/TableColumnCell';
import TableRowEditCell from '../../../molecules/TableRowEditCell';
import TableRowTextCell from '../../../molecules/TableRowTextCell';

const useStyles = makeStyles((theme: Theme) => ({
  table: {
    minWidth: 650,
    overflow: 'scroll',
  },
  paper: {
    marginTop: theme.spacing(2),
  },
}));

interface SummaryAccomodationTableProps {
  accAmountPaid: string[];
  accEXRate: string[];
  data: any[];
  columns: string[];
  setAccAmountPaid: any;
  setAccEXRate: any;
}

function SummaryAccomodationTable({
  accAmountPaid,
  accEXRate,
  data,
  columns,
  setAccAmountPaid,
  setAccEXRate,
}: SummaryAccomodationTableProps) {
  const classes = useStyles();

  const onAccAmountPaidChange = (val: string, i: number) => {
    const temp = [...accAmountPaid];
    temp[i] = val;
    setAccAmountPaid(temp);
  };

  const onAccEXRateChange = (val: string, i: number) => {
    const temp = [...accEXRate];
    temp[i] = val;
    setAccEXRate(temp);
  };

  return (
    <TableContainer className={classes.paper} component={Paper}>
      <Table className={classes.table} aria-label="costing table">
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableColumnCell
                key={index + 50}
                align="center"
                color="black"
                column={column}
              />
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index + 100}>
              <TableRowTextCell
                cell={{
                  align: 'center',
                  title: row.nights,
                  colors: ['#464E5F'],
                  weight: 400,
                }}
              />
              <TableRowTextCell
                cell={{
                  align: 'center',
                  title: row.name,
                  colors: ['#464E5F'],
                  weight: 400,
                }}
              />
              <TableRowTextCell
                cell={{
                  align: 'center',
                  title: row.roomType,
                  colors: ['#464E5F'],
                  weight: 400,
                }}
              />
              <TableRowTextCell
                cell={{
                  align: 'center',
                  title: 'Bed',
                  colors: ['#464E5F'],
                  weight: 400,
                }}
              />
              <TableRowTextCell
                cell={{
                  align: 'center',
                  title: row.roomRate,
                  colors: ['#464E5F'],
                  weight: 400,
                }}
              />
              <TableRowTextCell
                cell={{
                  align: 'center',
                  title: row.mealPlan,
                  colors: ['#464E5F'],
                  weight: 400,
                }}
              />
              <TableRowTextCell
                cell={{
                  align: 'center',
                  title: row.total,
                  colors: ['#464E5F'],
                  weight: 400,
                }}
              />
              <TableRowEditCell
                value={accAmountPaid[index]}
                inputTextField
                align="center"
                select={false}
                onChange={(val) => onAccAmountPaidChange(val, index)}
                lkrAdornment
              />
              <TableRowEditCell
                value={accEXRate[index]}
                inputTextField
                align="center"
                select={false}
                onChange={(val) => onAccEXRateChange(val, index)}
              />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default SummaryAccomodationTable;
