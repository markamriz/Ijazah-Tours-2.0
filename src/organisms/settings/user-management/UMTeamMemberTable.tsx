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
import { SettingsTeamMember } from '../../../utils/types';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    overflow: 'scroll',
  },
});

interface UMTeamMemberTableProps {
  data: SettingsTeamMember[];
  columns: string[];
  deleteTeamMember: (row: SettingsTeamMember) => void;
  onEditTeamMemberClick: (row: SettingsTeamMember) => void;
}

function UMTeamMemberTable({
  data,
  columns,
  deleteTeamMember,
  onEditTeamMemberClick,
}: UMTeamMemberTableProps) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="team member table">
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
          {data.map((row: SettingsTeamMember) => (
            <TableRow key={uuid()}>
              <TableRowTextCell
                key={uuid()}
                cell={{
                  align: 'center',
                  title: row.firstName,
                  colors: ['#464E5F', '#B5B5C3'],
                  weight: 400,
                }}
              />
              <TableRowTextCell
                key={uuid()}
                cell={{
                  align: 'center',
                  title: row.lastName,
                  colors: ['#464E5F', '#B5B5C3'],
                  weight: 400,
                }}
              />
              <TableRowTextCell
                key={uuid()}
                cell={{
                  align: 'center',
                  title: row.email,
                  colors: ['#464E5F', '#B5B5C3'],
                  weight: 400,
                }}
              />
              <TableRowTextCell
                key={uuid()}
                cell={{
                  align: 'center',
                  title: row.createdAt?.toDate()?.toLocaleDateString(),
                  colors: ['#464E5F', '#B5B5C3'],
                  weight: 400,
                }}
              />
              <TableRowTextCell
                key={uuid()}
                cell={{
                  align: 'center',
                  title: row.role,
                  colors: ['#464E5F', '#B5B5C3'],
                  weight: 400,
                }}
              />
              <TableRowTextCell
                key={uuid()}
                cell={{
                  align: 'center',
                  title: row.status,
                  colors: ['#464E5F', '#B5B5C3'],
                  weight: 400,
                }}
              />
              <TableRowIconCell
                key={uuid()}
                align="center"
                onClick={() => onEditTeamMemberClick(row)}
                textColor="#B5B5C3"
                size="small"
                padding="8px"
                children={<EditOutlinedIcon style={{ color: 'green' }} />}
              />
              <TableRowIconCell
                key={uuid()}
                align="center"
                onClick={() => deleteTeamMember(row)}
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

export default UMTeamMemberTable;
