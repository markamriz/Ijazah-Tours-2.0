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
import _ from 'lodash';

import TableColumnCell from '../../../../../molecules/TableColumnCell';
import TableRowEditCell from '../../../../../molecules/TableRowEditCell';
import TableRowIconCell from '../../../../../molecules/TableRowIconCell';
import TableRowTextCell from '../../../../../molecules/TableRowTextCell';
import { paxOptions } from '../../../../../utils/helpers';
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

interface AccomodationTableProps {
  selectedAccomodations: UserAccomodation[];
  columns: string[];
  selectedAccomodationsNights: string[];
  selectedAccomodationsRoomTypes: string[];
  selectedAccomodationsMealPlans: string[];
  selectedAccomodationsPax: string[];
  setSelectedAccomodationsNights: any;
  setSelectedAccomodationsRoomTypes: any;
  setSelectedAccomodationsMealPlans: any;
  setSelectedAccomodationsPax: any;
  deleteAccomodation: (row: UserAccomodation) => void;
}

function AccomodationTable({
  columns,
  selectedAccomodations,
  selectedAccomodationsNights,
  selectedAccomodationsRoomTypes,
  selectedAccomodationsMealPlans,
  setSelectedAccomodationsNights,
  selectedAccomodationsPax,
  setSelectedAccomodationsRoomTypes,
  setSelectedAccomodationsMealPlans,
  setSelectedAccomodationsPax,
  deleteAccomodation,
}: AccomodationTableProps) {
  const classes = useStyles();
  return (
    <TableContainer className={classes.paper} component={Paper}>
      <Table className={classes.table} aria-label="quotations table">
        <TableHead>
          <TableRow>
            {columns.map((column, i) => (
              <TableColumnCell
                key={i + 50}
                align="center"
                color="black"
                column={column}
              />
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {selectedAccomodations?.length > 0 && selectedAccomodations.map((row, index) => {
            const roomTypes = Object.keys(row.categoryValues).map((cat) => (
              { value: cat, label: cat }
            ));
            const roomTypeOptions = row.rates
              .map((rate) => rate.newRateType)
              .map((rate) => ({ value: rate, label: rate }));

            const mealPlans = row.rates.map((rate) => (
              { value: rate.newMealPlan, label: rate.newMealPlan }
            ));

            const onRoomTypeChange = (v: string) => {
              const temp = [...selectedAccomodationsRoomTypes];
              temp.splice(index, 1, v);
              setSelectedAccomodationsRoomTypes(temp);
            };

            const onMealPlanChange = (v: string) => {
              const temp = [...selectedAccomodationsMealPlans];
              temp.splice(index, 1, v);
              setSelectedAccomodationsMealPlans(temp);
            };

            const onNightsChange = (v: string) => {
              const temp = [...selectedAccomodationsNights];
              temp.splice(index, 1, v);
              setSelectedAccomodationsNights(temp);
            };

            const onPaxChange = (v: string) => {
              const temp = [...selectedAccomodationsPax];
              temp.splice(index, 1, v);
              setSelectedAccomodationsPax(temp);
            };

            const allRoomTypes = _.uniqBy([...roomTypes, ...roomTypeOptions], 'value');

            return (
              <TableRow key={index + 100}>
                <TableRowTextCell
                  cell={{
                    align: 'center',
                    title: row.country,
                    colors: ['#464E5F'],
                    weight: 400,
                  }}
                />
                <TableRowEditCell
                  type="Nights"
                  select={false}
                  value={selectedAccomodationsNights[index]}
                  onCountChange={onNightsChange}
                  align="center"
                />
                <TableRowTextCell
                  cell={{
                    align: 'center',
                    title: row.accomodationType,
                    colors: ['#464E5F'],
                    weight: 400,
                  }}
                />
                <TableRowTextCell
                  cell={{
                    align: 'center',
                    title: row.name,
                    colors: ['#464E5F'],
                    weight: 400,
                  }}
                />
                {row.pax === '' ? (
                  <TableRowEditCell
                    select
                    type="Pax"
                    value={selectedAccomodationsPax[index]}
                    onCountChange={onPaxChange}
                    options={paxOptions}
                    align="center"
                  />
                ) : (
                  <TableRowTextCell
                    cell={{
                      align: 'center',
                      title: row.pax,
                      colors: ['#464E5F'],
                      weight: 400,
                    }}
                  />
                )}
                <TableRowEditCell
                  select
                  type="Room Type"
                  value={selectedAccomodationsRoomTypes[index] || ''}
                  onSelectChange={onRoomTypeChange}
                  options={allRoomTypes}
                  align="center"
                />
                <TableRowEditCell
                  select
                  type="Meal Plan"
                  value={selectedAccomodationsMealPlans[index] || ''}
                  onSelectChange={onMealPlanChange}
                  options={mealPlans}
                  align="center"
                />
                <TableRowTextCell
                  cell={{
                    align: 'center',
                    title: row.city,
                    colors: ['#464E5F'],
                    weight: 400,
                  }}
                />
                <TableRowIconCell
                  align="center"
                  onClick={() => deleteAccomodation(row)}
                  textColor="#B5B5C3"
                  size="small"
                  padding="8px"
                  children={<CloseIcon style={{ color: 'black' }} />}
                />
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default AccomodationTable;
