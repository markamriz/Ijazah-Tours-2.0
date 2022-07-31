import { ChangeEvent, MouseEvent, useState } from 'react';

import {
  makeStyles,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Theme,
} from '@material-ui/core';
import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

import { db } from '../../../firebase';
import GuestProfile from '../../../molecules/GuestProfile';
import TablePaginationActions from '../../../molecules/TableBottomPagination';
import TableHead from '../../../molecules/TableHead';
import TableRowButtonCell from '../../../molecules/TableRowButtonCell';
import TableRowTextCell from '../../../molecules/TableRowTextCell';
import { selectUser } from '../../../redux/userSlice';
import { getComparator, stableSort, tourTypeOptions } from '../../../utils/helpers';
import { Order, UserAccomodation } from '../../../utils/types';

const headCells = [
  { id: 'name', label: 'GUEST' },
  { id: 'refNum', label: 'REF NUM' },
  { id: 'quoteTitle', label: 'TITLE' },
  { id: 'daysAndNights', label: 'DURATION (DAYS)' },
  { id: 'updatedAt', label: 'SHARED DATE' },
  { id: 'creator', label: 'OWNED BY' },
  { id: 'netPrice', label: 'PRICE' },
  { id: '...', label: '' },
  { id: '...1', label: '' },
  { id: '...2', label: '' },
  { id: '...3', label: '' },
];

interface QuotationsTableProps {
  rowdata: any[];
  setCloned: any;
  setShared: any;
  setClosed: any;
}

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

function QuotationsTable({
  rowdata,
  setCloned,
  setShared,
  setClosed,
}: QuotationsTableProps) {
  const user = useSelector(selectUser);
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openProfileMenu, setOpenProfileMenu] = useState<any>(new Array(rowdata.length).fill(null));
  const handleClickProfileMenu = (event: MouseEvent<HTMLButtonElement>, i: number) => {
    const updated = [...openProfileMenu];
    updated[i] = event.currentTarget;
    setOpenProfileMenu(updated);
  };
  const handleCloseProfileMenu = (i: number) => {
    const updated = [...openProfileMenu];
    updated[i] = null;
    setOpenProfileMenu(updated);
  };

  const history = useHistory();

  const handleRequestSort = (
    _: MouseEvent<HTMLSpanElement>,
    property: string,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (_: unknown, pg: number) => {
    setPage(pg);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const shareAndAddReminder = async (row: any) => {
    setShared(true);
    await setDoc(doc(db, 'Dashboard Tasks', String(`${row.quoteNo}-create-quote`)), {
      status: 'Creation of Quote',
      title: row.quoteTitle,
      stage: 'C',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      completed: false,
      creator: user,
      refNum: row.refNum,
    });

    await setDoc(doc(db, 'Approval Quotations', row.id), {
      ...row,
      status: 'SHARED',
      updatedAt: serverTimestamp(),
    });

    const startDate = new Date();
    const endDate = new Date();
    const calendarEvent = {
      summary: 'Creation of Quote',
      description: `Reminder - Creation of Quote ${row.quoteTitle}`,
      start: {
        dateTime: startDate.toISOString(),
      },
      end: {
        dateTime: new Date(endDate.setDate(startDate.getDate() + 10)).toISOString(),
      },
    };

    const request = (window as any).gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: calendarEvent,
    });

    request.execute(() => { });

    window.open('mailto:');
    setShared(false);
  };

  const cloneQuote = async (row: any) => {
    setCloned(true);
    const qData = (await getDocs(collection(db, 'Approval Quotations'))).docs;
    const aqData = qData.map((dc) => dc.data());
    const quoteNo = aqData.length + 1;

    const guestDetails = {
      ...row,
      quoteNo,
      creator: user,
      quoteTitle: `${row.quoteTitle} COPY`,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'IN PROGRESS',
    };

    await setDoc(doc(db, 'Approval Quotations', uuid()), {
      ...guestDetails,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await cloneVouchers(guestDetails);
    setCloned(false);
  };

  const cloneVouchers = async (guestDetails: any) => {
    await cloneVoucher(guestDetails, 'Driver Voucher', 'Driver');
    await cloneVoucher(guestDetails, 'Itinerary Voucher', 'Itinerary');
    await cloneVoucher(guestDetails, 'Tour Confirmation Voucher', 'Proforma Invoice');
    await cloneVoucher(guestDetails, 'Cash Receipt', 'Cash Receipt');

    if (guestDetails.tourType === tourTypeOptions[0].value) {
      await cloneAccomodationVouchers(guestDetails, 'Supplier Voucher');
    }
  };

  const cloneVoucher = async (guestDetails: any, type: string, title: string) => {
    let vId = '';
    switch (title) {
    case 'Driver':
      vId = `${guestDetails.quoteTitle.slice(0, 5)} DV`;
      break;
    case 'Itinerary':
      vId = `${guestDetails.quoteTitle.slice(0, 5)} IV`;
      break;
    case 'Proforma Invoice':
      vId = `${guestDetails.quoteTitle.slice(0, 5)} PIV`;
      break;
    case 'Cash Receipt':
    default:
      vId = `${guestDetails.quoteTitle.slice(0, 5)} CRV`;
      break;
    }

    await setDoc(doc(
      db,
      'Vouchers',
      String(guestDetails.quoteNo),
      'Vouchers',
      `${String(guestDetails.quoteNo)}-${type}-${title}`,
    ), {
      vId,
      guestDetails,
      type,
      title,
      quoteNo: String(guestDetails.quoteNo),
      quotationTitle: guestDetails.quoteTitle,
      mainVId: `${guestDetails.quoteTitle.slice(0, 5)} V`,
      driverDetails: guestDetails.driverChoice,
      accomodationDetails: guestDetails.accDetails.selectedAccomodations,
      completed: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  const cloneAccomodationVouchers = async (guestDetails: any, type: string) => {
    (guestDetails.accDetails.selectedAccomodations as UserAccomodation[]).forEach(async (acc) => {
      const accVName = acc.name.toUpperCase().split(' ').map((w) => w[0]).join('');
      const vId = `${guestDetails.quoteTitle.slice(0, 5)} HV${accVName}`;

      await setDoc(doc(
        db,
        'Vouchers',
        String(guestDetails.quoteNo),
        'Vouchers',
        `${String(guestDetails.quoteNo)}-${type}-${acc.name}`,
      ), {
        vId,
        guestDetails,
        type,
        title: acc.name,
        mainVId: `${guestDetails.quoteTitle.slice(0, 5)} V`,
        quoteNo: String(guestDetails.quoteNo),
        quotationTitle: guestDetails.quoteTitle,
        driverDetails: guestDetails.driverChoice,
        accomodationDetails: acc,
        completed: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    });
  };

  const closeQuote = async (row: any) => {
    setClosed(true);
    await setDoc(doc(db, 'Approval Quotations', row.id), {
      ...row,
      status: 'CLOSED',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    setClosed(false);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table
            className={classes.table}
            stickyHeader
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="quotations table"
          >
            <TableHead
              classes={classes}
              headCells={headCells}
              numSelected={0}
              order={order as Order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rowdata.length}
            />
            <TableBody>
              {stableSort(rowdata, getComparator(order as Order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row: any, i: number) => (
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={row.id}
                  >
                    <TableCell align="left">
                      <GuestProfile
                        image={row.profilePic}
                        title={row.name}
                        titleWeight={300}
                        paraColor="#464E5F"
                      />
                    </TableCell>
                    <TableRowTextCell
                      cell={{
                        align: 'left',
                        title: row.refNum,
                        colors: ['#464E5F', '#B5B5C3'],
                        weight: 300,
                      }}
                    />
                    <TableRowTextCell
                      cell={{
                        align: 'left',
                        title: row.quoteTitle,
                        colors: ['#464E5F', '#B5B5C3'],
                        weight: 300,
                      }}
                    />
                    <TableRowTextCell
                      cell={{
                        align: 'left',
                        title: row.daysAndNights.split('-')[0],
                        colors: ['#464E5F', '#B5B5C3'],
                        weight: 300,
                      }}
                    />
                    <TableRowTextCell
                      cell={{
                        align: 'left',
                        title: new Date(row.updatedAt?.toDate()).toDateString(),
                        colors: ['#464E5F', '#B5B5C3'],
                        weight: 300,
                      }}
                    />
                    <TableRowTextCell
                      cell={{
                        align: 'left',
                        title: row.creator.firstName,
                        colors: ['#464E5F', '#B5B5C3'],
                        weight: 300,
                      }}
                    />
                    <TableRowTextCell
                      cell={{
                        align: 'left',
                        title: row.netPrice,
                        colors: ['#464E5F', '#B5B5C3'],
                        weight: 600,
                      }}
                    />
                    <TableRowButtonCell
                      onClick={() => null}
                      align="right"
                      btnWidth="8rem"
                      btnSize="medium"
                      btnBorderRadius="0.5rem"
                      cell={{ status: row.status }}
                      btnDisabled
                    />
                    {row.status === 'APPROVED' || row.status === 'COMPLETED' ? (
                      <TableRowButtonCell
                        onClick={() => history.replace(`/quote/summary/${row.id}`)}
                        align="right"
                        btnWidth="8rem"
                        btnSize="medium"
                        btnBorderRadius="0.5rem"
                        btnText="Summary"
                        btnColors={['#7595EC', '#333333']}
                      />
                    ) : (
                      <TableRowTextCell
                        cell={{
                          align: 'left',
                          title: '',
                          colors: ['#464E5F', '#B5B5C3'],
                          weight: 300,
                        }}
                      />
                    )}
                    <TableRowButtonCell
                      onClick={() => shareAndAddReminder(row)}
                      align="left"
                      btnWidth="8rem"
                      btnSize="medium"
                      btnBorderRadius="0.5rem"
                      btnText="Share"
                      btnColors={['#7879F1', '#ffffff']}
                    />
                    <TableRowButtonCell
                      onClick={(event: any) => handleClickProfileMenu(event, i)}
                      align="right"
                      btnWidth="8rem"
                      btnSize="medium"
                      btnBorderRadius="0.5rem"
                      btnText="More"
                      btnColors={['#C9F7F5', '#208883']}
                    />
                    <Menu
                      id={row.id}
                      anchorEl={openProfileMenu[i]}
                      keepMounted
                      open={Boolean(openProfileMenu[i])}
                      onClose={() => handleCloseProfileMenu(i)}
                    >
                      <MenuItem onClick={() => window.open(row.pdfURL)}>View Quote</MenuItem>
                      <MenuItem onClick={() => history.replace(`/quote/quotations/edit/${row.id}/customer`)}>Edit Quote</MenuItem>
                      <MenuItem onClick={() => cloneQuote(row)}>Clone Quote</MenuItem>
                      <MenuItem onClick={() => closeQuote(row)}>Close Quote</MenuItem>
                    </Menu>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rowdata.length}
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

export default QuotationsTable;
