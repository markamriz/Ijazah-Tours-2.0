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
import { useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';

import TableColumnCell from '../../../../../molecules/TableColumnCell';
import TableRowTextCell from '../../../../../molecules/TableRowTextCell';
import { selectWith2NavbarWidth } from '../../../../../redux/containerSizeSlice';
import { UserAccomodation } from '../../../../../utils/types';

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

interface ApprovalAccomodationTableProps {
  data: UserAccomodation[];
  columns: string[];
}

function ApprovalAccomodationTable({
  data,
  columns,
}: ApprovalAccomodationTableProps) {
  const width = useSelector(selectWith2NavbarWidth);
  const classes = useStyles();

  return (
    <TableContainer
      style={width < 1500 ? { width: '100%' } : {}}
      className={classes.paper}
      component={Paper}
    >
      <Table className={classes.table} aria-label="approval accomodation table">
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
          {data.map((row) => {
            const roomView = row.views.find((view) => view.checked);

            return (
              <TableRow key={uuid()}>
                <TableRowTextCell
                  key={uuid()}
                  cell={{
                    align: 'center',
                    title: row.nights,
                    colors: ['#464E5F'],
                    weight: 400,
                  }}
                />
                <TableRowTextCell
                  key={uuid()}
                  cell={{
                    align: 'center',
                    title: row.name,
                    colors: ['#464E5F'],
                    weight: 400,
                  }}
                />
                <TableRowTextCell
                  key={uuid()}
                  cell={{
                    align: 'center',
                    title: row.roomType,
                    colors: ['#464E5F'],
                    weight: 400,
                  }}
                />
                <TableRowTextCell
                  key={uuid()}
                  cell={{
                    align: 'center',
                    title: row.mealPlan,
                    colors: ['#464E5F'],
                    weight: 400,
                  }}
                />
                <TableRowTextCell
                  key={uuid()}
                  cell={{
                    align: 'center',
                    title: roomView ? roomView.val : 'None',
                    colors: ['#464E5F'],
                    weight: 400,
                  }}
                />
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ApprovalAccomodationTable;
