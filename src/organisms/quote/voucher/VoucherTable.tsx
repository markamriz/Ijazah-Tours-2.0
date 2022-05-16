import {
  ChangeEvent,
  Fragment,
  useEffect,
  useState,
} from 'react';

import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import { useHistory } from 'react-router-dom';

import TableColumnCell from '../../../molecules/TableColumnCell';
import TableRowButtonCell from '../../../molecules/TableRowButtonCell';
import TableRowCheckboxCell from '../../../molecules/TableRowCheckboxCell';
import TableRowIconCell from '../../../molecules/TableRowIconCell';

interface VoucherTableProps {
  columns: string[];
  voucherData: any[];
  setVoucherData: any;
}

function Row({
  row,
  voucherData,
  setVoucherData,
}: any) {
  const [open, setOpen] = useState(false);
  const [rowChecked, setRowChecked] = useState(
    row.status === 'COMPLETE'
    || row.every((voucher: { completed: boolean }) => voucher.completed === true),
  );

  const [vouchersChecked, setVouchersChecked] = useState(
    row.map((voucher: { completed: boolean }) => voucher.completed === true),
  );

  const history = useHistory();

  useEffect(() => {
    getOverallRowStatus();
  }, []);

  const keyboardIcon = open ? (
    <KeyboardArrowDownIcon />
  ) : (
    <KeyboardArrowLeftIcon />
  );

  const onChangeRowStatus = (e: ChangeEvent<HTMLInputElement>) => {
    const { quoteNo } = row[0];
    const tempUpdatedVoucherData = { ...voucherData };
    const tempUpdatedRowData = tempUpdatedVoucherData[quoteNo].map((voucher: any) => (
      { ...voucher, completed: e.target.checked }
    ));
    tempUpdatedVoucherData[quoteNo] = tempUpdatedRowData;

    setVoucherData(tempUpdatedVoucherData);
    setRowChecked(e.target.checked);
    setVouchersChecked(vouchersChecked.map((checked: boolean) => !checked));
  };

  const onChangeVoucherStatus = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const { quoteNo } = row[0];
    const tempUpdatedVoucherData = { ...voucherData };
    const tempUpdatedRowData = [...tempUpdatedVoucherData[quoteNo]];
    tempUpdatedRowData.splice(index, 1, {
      ...row[index],
      completed: e.target.checked,
    });
    tempUpdatedVoucherData[quoteNo] = tempUpdatedRowData;

    const tempChecked = [...vouchersChecked];
    tempChecked[index] = e.target.checked;

    setVoucherData(tempUpdatedVoucherData);
    setVouchersChecked(tempChecked);
    setRowChecked(tempChecked.every((v: boolean) => v === true));
    getOverallRowStatus();
  };

  const getOverallRowStatus = () => {
    let status = 'COMPLETE';
    vouchersChecked.forEach((checked: boolean) => {
      if (!checked) {
        status = 'TODO';
      }
    });

    return status;
  };

  const getVoucherStatus = (index: number) => {
    let status = 'SHARE';
    if (vouchersChecked[index]) {
      status = 'COMPLETE';
    }

    return status;
  };

  const getStatusBtnColors = () => (
    getOverallRowStatus() === 'COMPLETE' ? ['#29CC97', '#ffffff'] : ['#7879F1', '#ffffff']
  );

  const getVoucherLink = (type: string) => {
    let linkType = 'supplier';
    switch (type) {
    case 'Cash Receipt':
      linkType = 'receipt';
      return linkType;
    case 'Tour Confirmation Voucher':
      linkType = 'tour-confirmation';
      return linkType;
    case 'Itinerary Voucher':
      linkType = 'itinerary';
      return linkType;
    case 'Driver Voucher':
      linkType = 'driver';
      return linkType;
    default:
      return linkType;
    }
  };

  const getMailTo = (voucher: any) => {
    const { type } = voucher;
    let mailTo = '';
    switch (type) {
    case 'Cash Receipt':
      mailTo = voucher.guestDetails.email || '';
      return mailTo;
    case 'Tour Confirmation Voucher':
    case 'Itinerary Voucher':
      return mailTo;
    case 'Driver Voucher':
      mailTo = voucher.driverDetails.email;
      return mailTo;
    default:
      mailTo = voucher.accomodationDetails.email;
      return mailTo;
    }
  };

  return (
    <Fragment>
      <TableRow>
        <TableRowCheckboxCell
          name={row[0].mainVId}
          checked={rowChecked}
          onChange={onChangeRowStatus}
          align="left"
        />
        <TableCell>{row[0].quotationTitle}</TableCell>
        <TableRowButtonCell
          onClick={() => null}
          align="left"
          btnWidth="8rem"
          btnSize="medium"
          btnBorderRadius="0.5rem"
          btnText={getOverallRowStatus()}
          btnColors={getStatusBtnColors()}
          btnDisabled
        />
        <TableRowIconCell
          align="left"
          size="small"
          onClick={() => setOpen(!open)}
          textColor="#5344C2"
          padding="0"
        >
          {keyboardIcon}
        </TableRowIconCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Table size="small" aria-label="vouchers">
                <TableHead>
                  <TableRow>
                    <TableColumnCell color="black" column="Voucher ID" />
                    <TableColumnCell color="black" column="Voucher Title" />
                    <TableColumnCell color="black" column="Status" />
                    <TableColumnCell color="black" column="" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.map((voucher: any, index: number) => (
                    <TableRow key={voucher.id}>
                      <TableRowCheckboxCell
                        name={voucher.vId}
                        checked={vouchersChecked[index]}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => (
                          onChangeVoucherStatus(e, index)
                        )}
                        align="left"
                      />
                      <TableCell>{voucher.title}</TableCell>
                      <TableRowButtonCell
                        onClick={() => (
                          getVoucherStatus(index) === 'SHARE'
                            ? history.replace(`/quote/voucher/${getVoucherLink(voucher.type)}/${voucher.id}+${voucher.quoteNo}`)
                            : null
                        )}
                        align="left"
                        btnWidth="8rem"
                        btnSize="medium"
                        btnBorderRadius="0.5rem"
                        btnText={getVoucherStatus(index)}
                        btnColors={
                          vouchersChecked[index]
                            ? ['#29CC97', '#ffffff']
                            : ['#7879F1', '#ffffff']
                        }
                        btnDisabled={vouchersChecked[index]}
                      />
                      <TableRowButtonCell
                        onClick={() => window.open(`mailto:${getMailTo(voucher)}`)}
                        align="left"
                        btnWidth="8rem"
                        btnSize="medium"
                        btnBorderRadius="0.5rem"
                        btnText="SEND EMAIL"
                        btnColors={['#29CC97', '#ffffff']}
                      />
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
}

export default function VoucherTable({
  columns,
  voucherData,
  setVoucherData,
}: VoucherTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableColumnCell key={index} color="black" column={column} />
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(voucherData).map((row: any, index) => (
            <Row
              key={index}
              row={voucherData[row]}
              voucherData={voucherData}
              setVoucherData={setVoucherData}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
