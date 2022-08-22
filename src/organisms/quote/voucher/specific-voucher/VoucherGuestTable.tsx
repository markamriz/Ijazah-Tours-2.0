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

import DivAtom from '../../../../atoms/DivAtom';
import SpanAtom from '../../../../atoms/SpanAtom';
import TableColumnCell from '../../../../molecules/TableColumnCell';
import TableRowTextCell from '../../../../molecules/TableRowTextCell';
import { selectWithNavbarWidth } from '../../../../redux/containerSizeSlice';
import { voucherStyles } from '../../../../styles';

const useStyles = makeStyles((theme: Theme) => ({
  table: {
    minWidth: 650,
    overflow: 'scroll',
  },
  accomodationPaper: {
    marginTop: theme.spacing(2),
    width: '60%',
  },
  guestPaper: {
    marginTop: theme.spacing(2),
    width: '50%',
  },
}));

interface VoucherGuestTableProps {
  data: any;
  accColumns: string[];
  guestColumns: string[];
  type?: string;
}

function VoucherGuestTable({
  data,
  accColumns,
  guestColumns,
  type,
}: VoucherGuestTableProps) {
  const width = useSelector(selectWithNavbarWidth);
  const classes = useStyles();

  const getChildrenAgeString = () => {
    let ageString = '';
    data.guestDetails.children.forEach((child: string, index: number) => {
      if (index === data.guestDetails.children.length - 1) {
        ageString += child;
      } else {
        ageString = `${ageString} ${child}, `;
      }
    });

    return ageString;
  };

  const RenderColumns = (col: string[]) => (
    col.map((column) => (
      <TableColumnCell
        greenBorder
        key={uuid()}
        align="center"
        color="#1C5BBA"
        column={column}
      />
    ))
  );

  const GuestTable = () => (
    <TableContainer
      style={width < 1500 ? { width: '100%' } : {}}
      className={classes.guestPaper}
      component={Paper}
    >
      <Table className={classes.table} aria-label="voucher guest table">
        <TableHead>
          <TableRow style={{ borderTop: '1px solid #41E93E' }}>
            {RenderColumns(guestColumns)}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow key={uuid()}>
            <TableRowTextCell
              key={uuid()}
              cell={{
                align: 'center',
                title: data.guestDetails.adults,
                colors: ['#464E5F'],
                weight: 400,
              }}
            />
            <TableRowTextCell
              key={uuid()}
              cell={{
                align: 'center',
                title: data.guestDetails.children.length,
                colors: ['#464E5F'],
                weight: 400,
              }}
            />
            <TableRowTextCell
              key={uuid()}
              cell={{
                align: 'center',
                title: getChildrenAgeString(),
                colors: ['#464E5F'],
                weight: 400,
              }}
            />
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );

  const AccomodationTable = () => (
    <TableContainer
      style={width < 1500 ? { width: '100%' } : {}}
      className={classes.accomodationPaper}
      component={Paper}
    >
      <Table className={classes.table} aria-label="approval accomodation table">
        <TableHead>
          <TableRow style={{ borderTop: '1px solid #41E93E' }}>
            {RenderColumns(accColumns)}
          </TableRow>
        </TableHead>
        <TableBody>
          {type === 'accomodation' ? (
            <TableRow key={uuid()}>
              <TableRowTextCell
                key={uuid()}
                cell={{
                  align: 'center',
                  title: data.accomodationDetails.nights,
                  colors: ['#464E5F'],
                  weight: 400,
                }}
              />
              <TableRowTextCell
                key={uuid()}
                cell={{
                  align: 'center',
                  title: [data.accomodationDetails.pax, data.accomodationDetails.additionalEntries?.map((entry: any) => entry.pax)].flat().filter((x) => x !== '' && x !== undefined).join(' | '),
                  colors: ['#464E5F'],
                  weight: 400,
                }}
              />
              <TableRowTextCell
                key={uuid()}
                cell={{
                  align: 'center',
                  title: [data.accomodationDetails.roomType, data.accomodationDetails.additionalEntries?.map((entry: any) => entry.roomType)].flat().filter((x) => x !== '' && x !== undefined).join(' | '),
                  colors: ['#464E5F'],
                  weight: 400,
                }}
              />
              <TableRowTextCell
                key={uuid()}
                cell={{
                  align: 'center',
                  title: [data.accomodationDetails.mealPlan, data.accomodationDetails.additionalEntries?.map((entry: any) => entry.mealPlan)].flat().filter((x) => x !== '' && x !== undefined).join(' | '),
                  colors: ['#464E5F'],
                  weight: 400,
                }}
              />
              <TableRowTextCell
                key={uuid()}
                cell={{
                  align: 'center',
                  title: data.accomodationDetails.views.find((v: { checked: boolean }) => (
                    v.checked
                  ))?.val || 'None',
                  colors: ['#464E5F'],
                  weight: 400,
                }}
              />
            </TableRow>
          ) : (
            <>
              {data.accomodationDetails.map((row: any) => (
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
                      title: row.city,
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
                </TableRow>
              ))}
            </>
          )}
        </TableBody>
      </Table>
    </TableContainer >
  );

  return (
    <>
      <DivAtom style={voucherStyles.voucherTemplate.summaryDetails.multiTableContainer}>
        <p style={voucherStyles.voucherTemplate.summaryDetails.detailContainer}>
          <SpanAtom
            text="Guest Name"
            style={voucherStyles.voucherTemplate.summaryDetails.label}
          />
          <SpanAtom
            text={data.guestDetails.name}
            style={voucherStyles.voucherTemplate.summaryDetails.detail}
          />
        </p>
        {type === 'accomodation' && (
          <p style={voucherStyles.voucherTemplate.summaryDetails.detailContainer}>
            <SpanAtom
              text="Nationality"
              style={voucherStyles.voucherTemplate.summaryDetails.label}
            />
            <SpanAtom
              text={data.guestDetails.nationality}
              style={voucherStyles.voucherTemplate.summaryDetails.detail}
            />
          </p>
        )}
        <GuestTable />
        <AccomodationTable />
      </DivAtom>
    </>
  );
}

export default VoucherGuestTable;
