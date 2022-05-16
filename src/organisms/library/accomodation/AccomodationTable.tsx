import {
  ChangeEvent,
  MouseEvent,
  useState,
} from 'react';

import {
  Theme,
  makeStyles,
} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { useSelector } from 'react-redux';

import TablePaginationActions from '../../../molecules/TableBottomPagination';
import TableHead from '../../../molecules/TableHead';
import TableRowIconCell from '../../../molecules/TableRowIconCell';
import TableRowTextCell from '../../../molecules/TableRowTextCell';
import TableToolbar from '../../../molecules/TableToolbar';
import { selectUser } from '../../../redux/userSlice';
import { getComparator, roleOptions, stableSort } from '../../../utils/helpers';
import { LibraryAccomodation, Order } from '../../../utils/types';

const travelAgentCells = [
  { id: 'name', label: 'NAME' },
  { id: 'tel', label: 'TEL NUMBER' },
  { id: 'city', label: 'CITY' },
  { id: 'country', label: 'LOCATION' },
  { id: 'group', label: 'GROUP' },
];

const adminCells = [
  ...travelAgentCells,
  { id: '...', label: '' },
  { id: '...1', label: '' },
];

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

interface AccomodationTableProps {
  data: LibraryAccomodation[];
  search: string;
  setSearch: any;
  deleteAccomodation: (row: LibraryAccomodation) => void;
  onEditAccomodationClick: (row: LibraryAccomodation) => void;
}

function AccomodationTable({
  data,
  search,
  setSearch,
  deleteAccomodation,
  onEditAccomodationClick,
}: AccomodationTableProps) {
  const user = useSelector(selectUser);

  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (
    _: MouseEvent<HTMLSpanElement>,
    property: string,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n: LibraryAccomodation) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (
    _: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    name: string,
  ) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (_: unknown, pg: number) => {
    setPage(pg);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableToolbar
          search={search}
          setSearch={setSearch}
          numSelected={selected.length}
          addBtnText="Add Accomodation"
        />
        <TableContainer>
          <Table
            className={classes.table}
            stickyHeader
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="Library table"
          >
            <TableHead
              classes={classes}
              headCells={user.role === roleOptions[0].value ? adminCells : travelAgentCells}
              numSelected={selected.length}
              order={order as Order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {stableSort(data, getComparator(order as Order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row: LibraryAccomodation, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `library-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          onClick={(event) => handleClick(event, row.id)}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableRowTextCell
                        cell={{
                          align: 'left',
                          title: row.name,
                          colors: ['#B5B5C3'],
                          weight: 500,
                        }}
                      />
                      <TableRowTextCell
                        cell={{
                          align: 'left',
                          title: row.tel,
                          colors: ['#B5B5C3'],
                          weight: 500,
                        }}
                      />
                      <TableRowTextCell
                        cell={{
                          align: 'left',
                          title: row.city,
                          colors: ['#B5B5C3'],
                          weight: 500,
                        }}
                      />
                      <TableRowTextCell
                        cell={{
                          align: 'left',
                          title: row.country,
                          colors: ['#B5B5C3'],
                          weight: 500,
                        }}
                      />
                      <TableRowTextCell
                        cell={{
                          align: 'left',
                          title: row.group,
                          colors: ['#B5B5C3'],
                          weight: 500,
                        }}
                      />
                      {user.role === roleOptions[0].value && (
                        <>
                          <TableRowIconCell
                            align="center"
                            onClick={() => onEditAccomodationClick(row)}
                            textColor="#B5B5C3"
                            size="small"
                            padding="8px"
                            children={<EditOutlinedIcon style={{ color: 'green' }} />}
                          />
                          <TableRowIconCell
                            align="center"
                            onClick={() => deleteAccomodation(row)}
                            textColor="#B5B5C3"
                            size="small"
                            padding="8px"
                            children={<DeleteOutlinedIcon style={{ color: 'red' }} />}
                          />
                        </>
                      )}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
        />
      </Paper>
    </div>
  );
}

export default AccomodationTable;
