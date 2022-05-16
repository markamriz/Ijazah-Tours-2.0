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
import CloseIcon from '@material-ui/icons/Close';
import { useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';

import TableColumnCell from '../../../../../molecules/TableColumnCell';
import TableRowIconCell from '../../../../../molecules/TableRowIconCell';
import TableRowTextCell from '../../../../../molecules/TableRowTextCell';
import { selectWith2NavbarWidth } from '../../../../../redux/containerSizeSlice';
import { QuotationCostingRate } from '../../../../../utils/types';

const useStyles = makeStyles((theme: Theme) => ({
  table: {
    minWidth: 650,
    overflow: 'scroll',
  },
  paper: {
    marginTop: theme.spacing(2),
    width: '60%',
  },
}));

interface ApprovalRateComparisonTableProps {
  data: QuotationCostingRate[];
  columns: string[];
  deleteRate: (row: QuotationCostingRate) => void;
}

function ApprovalRateComparisonTable({
  data,
  columns,
  deleteRate,
}: ApprovalRateComparisonTableProps) {
  const width = useSelector(selectWith2NavbarWidth);

  const classes = useStyles();

  return (
    <TableContainer style={width < 1500 ? { width: '100%' } : {}} className={classes.paper} component={Paper}>
      <Table className={classes.table} aria-label="approval rate table">
        <TableHead>
          <TableRow style={{ borderTop: '1px solid #41E93E' }}>
            {columns.map((column) => (
              <TableColumnCell
                greenBorder
                key={uuid()}
                align="center"
                color="#1C5BBA"
                column={column}
              />
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={uuid()}>
              <TableRowTextCell
                key={uuid()}
                cell={{
                  align: 'center',
                  title: row.accomodation,
                  colors: ['#464E5F'],
                  weight: 400,
                }}
              />
              <TableRowTextCell
                key={uuid()}
                cell={{
                  align: 'center',
                  title: row.bookingEngine,
                  colors: ['#464E5F'],
                  weight: 400,
                }}
              />
              <TableRowTextCell
                key={uuid()}
                cell={{
                  align: 'center',
                  title: row.rate,
                  colors: ['#464E5F'],
                  weight: 400,
                }}
              />
              <TableRowIconCell
                align="center"
                onClick={() => deleteRate(row)}
                textColor="#B5B5C3"
                size="small"
                padding="8px"
                children={<CloseIcon style={{ color: 'black' }} />}
              />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ApprovalRateComparisonTable;
