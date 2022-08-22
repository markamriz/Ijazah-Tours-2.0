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

import TableColumnCell from '../../../../../molecules/TableColumnCell';
import TableRowTextCell from '../../../../../molecules/TableRowTextCell';
import { UserAccomodation } from '../../../../../utils/types';

const useStyles = makeStyles((theme: Theme) => ({
  table: {
    minWidth: 650,
    overflow: 'scroll',
  },
  paper: {
    marginTop: theme.spacing(2),
  },
}));

interface CostingAccomodationTableProps {
  data: UserAccomodation[];
  columns: string[];
  accTotal: string;
}

function CostingAccomodationTable({
  data,
  columns,
  accTotal,
}: CostingAccomodationTableProps) {
  const classes = useStyles();

  return (
    <TableContainer className={classes.paper} component={Paper}>
      <Table className={classes.table} aria-label="costing table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableColumnCell
                key={uuid()}
                align="center"
                color="black"
                column={column}
              />
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => ((row.isMultiple && row.additionalEntries) || !row.isMultiple) && (
            <TableRow key={uuid()}>
              <TableRowTextCell
                key={uuid()}
                cell={{
                  align: 'center',
                  title: row.country,
                  colors: ['#464E5F'],
                  weight: 400,
                }}
              />
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
                  title: [row.pax, row.additionalEntries?.map((entry) => entry.pax)].flat().filter((x) => x !== '' && x !== undefined).join(' | '),
                  colors: ['#464E5F'],
                  weight: 400,
                }}
              />
              <TableRowTextCell
                key={uuid()}
                cell={{
                  align: 'center',
                  title: [row.roomType, row.additionalEntries?.map((entry) => entry.roomType)].flat().filter((x) => x !== '' && x !== undefined).join(' | '),
                  colors: ['#464E5F'],
                  weight: 400,
                }}
              />
              <TableRowTextCell
                key={uuid()}
                cell={{
                  align: 'center',
                  title: [row.mealPlan, row.additionalEntries?.map((entry) => entry.mealPlan)].flat().filter((x) => x !== '' && x !== undefined).join(' | '),
                  colors: ['#464E5F'],
                  weight: 400,
                }}
              />
              <TableRowTextCell
                key={uuid()}
                cell={{
                  align: 'center',
                  title: [row.roomRate, row.additionalEntries?.map((entry) => entry.roomRate)].flat().filter((x) => x !== '' && x !== undefined).join(' | '),
                  colors: ['#464E5F'],
                  weight: 400,
                }}
              />
              <TableRowTextCell
                key={uuid()}
                cell={{
                  align: 'center',
                  title: `$${Number(row.total.slice(1, row.total.length))}`,
                  colors: ['#464E5F'],
                  weight: 400,
                }}
              />
            </TableRow>
          ))}
          <TableRow>
            {[0, 0, 0, 0, 0, 0, 0].map(() => (
              <TableRowTextCell
                key={uuid()}
                cell={{
                  align: 'center',
                  title: '',
                  colors: ['#464E5F'],
                  weight: 400,
                }}
              />
            ))}
            <TableRowTextCell
              key={uuid()}
              cell={{
                align: 'center',
                title: `$${accTotal}`,
                colors: ['#464E5F'],
                weight: 600,
              }}
            />
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default CostingAccomodationTable;
