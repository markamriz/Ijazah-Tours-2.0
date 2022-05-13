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
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { v4 as uuid } from 'uuid';

import TableColumnCell from '../../../molecules/TableColumnCell';
import TableRowIconCell from '../../../molecules/TableRowIconCell';
import TableRowTextCell from '../../../molecules/TableRowTextCell';
import { SettingsLocation } from '../../../utils/types';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    overflow: 'scroll',
  },
});

interface LocationTableProps {
  data: SettingsLocation[];
  columns: string[];
  onEditLocationClick: (row: SettingsLocation) => void;
  deleteLocation: (row: SettingsLocation) => void;
}

function LocationTable({
  data,
  columns,
  onEditLocationClick,
  deleteLocation,
}: LocationTableProps) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="location table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableColumnCell
                key={uuid()}
                align="center"
                color="b5b5c3"
                column={column}
              />
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row: SettingsLocation) => (
            <TableRow key={uuid()}>
              <TableRowTextCell
                key={uuid()}
                cell={{
                  align: 'center',
                  title: row.location.value,
                  colors: ['#464E5F', '#B5B5C3'],
                  weight: 400,
                }}
              />
              <TableRowTextCell
                key={uuid()}
                cell={{
                  align: 'center',
                  title: row.cities.map((c) => c.value).join(', '),
                  colors: ['#464E5F', '#B5B5C3'],
                  weight: 400,
                }}
              />
              <TableRowIconCell
                align="center"
                onClick={() => onEditLocationClick(row)}
                textColor="#B5B5C3"
                size="small"
                padding="8px"
                children={<EditOutlinedIcon style={{ color: 'green' }} />}
              />
              <TableRowIconCell
                align="center"
                onClick={() => deleteLocation(row)}
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

export default LocationTable;
