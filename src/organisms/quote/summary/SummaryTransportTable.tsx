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

interface SummaryTransportTableProps {
  transportEXRate: string;
  transportAmountPaid: string;
  columns: string[];
  data: any;
  setTransportEXRate: any;
  setTransportAmountPaid: any;
}

function SummaryTransportTable({
  transportEXRate,
  transportAmountPaid,
  columns,
  data,
  setTransportEXRate,
  setTransportAmountPaid,
}: SummaryTransportTableProps) {
  const classes = useStyles();

  return (
    <TableContainer className={classes.paper} component={Paper}>
      <Table className={classes.table} aria-label="costing table">
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableColumnCell
                key={index + 5}
                align="center"
                color="black"
                column={column}
              />
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableRowTextCell
              cell={{
                align: 'center',
                title: data.transportRate,
                colors: ['#464E5F'],
                weight: 400,
              }}
            />
            <TableRowTextCell
              cell={{
                align: 'center',
                title: data.transportDays,
                colors: ['#464E5F'],
                weight: 400,
              }}
            />
            <TableRowTextCell
              cell={{
                align: 'center',
                title: data.transportTotal,
                colors: ['#464E5F'],
                weight: 400,
              }}
            />
            <TableRowEditCell
              value={transportAmountPaid}
              inputTextField
              align="center"
              select={false}
              onChange={(val) => setTransportAmountPaid(val)}
              lkrAdornment
            />
            <TableRowEditCell
              value={transportEXRate}
              inputTextField
              align="center"
              select={false}
              onChange={(val) => setTransportEXRate(val)}
            />
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default SummaryTransportTable;
