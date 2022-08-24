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
import { addBedOptions, paxOptions } from '../../../../../utils/helpers';
import { AccomodationNight, UserAccomodation } from '../../../../../utils/types';

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
  preset?: boolean;
  selectedAccomodationsNights?: { [k: string]: string };
  selectedAccomodationsAdditionalBed?: string[];
  selectedAccomodationsRoomTypes?: string[];
  selectedAccomodationsMealPlans?: string[];
  selectedAccomodationsPax?: string[];
  setSelectedAccomodationsAdditionalBed?: any;
  setSelectedAccomodationsNights?: any;
  setSelectedAccomodationsRoomTypes?: any;
  setSelectedAccomodationsMealPlans?: any;
  setSelectedAccomodationsPax?: any;
  deleteAccomodation: (row: UserAccomodation) => void;
}

function AccomodationTable({
  columns,
  preset,
  selectedAccomodations,
  selectedAccomodationsNights,
  selectedAccomodationsAdditionalBed,
  selectedAccomodationsRoomTypes,
  selectedAccomodationsMealPlans,
  setSelectedAccomodationsNights,
  selectedAccomodationsPax,
  setSelectedAccomodationsAdditionalBed,
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
          {selectedAccomodations?.length > 0
            && selectedAccomodations.map((row, index) => {
              const roomTypes = Object.keys(row.categoryValues).map((cat) => (
                { value: cat, label: cat }
              ));

              const roomTypeOptions = row.rates
                .map((rate) => rate.newRateType)
                .map((rate) => ({ value: rate, label: rate }));

              const mealPlans = row.rates.map((rate) => (
                { value: rate.newMealPlan, label: rate.newMealPlan }
              ));

              const allRoomTypes = _.uniqBy([...roomTypes, ...roomTypeOptions], 'value');

              const onRoomTypeChange = (v: string) => {
                const temp = [...selectedAccomodationsRoomTypes!];
                temp.splice(index, 1, v);
                setSelectedAccomodationsRoomTypes(temp);
              };

              const onMealPlanChange = (v: string) => {
                const temp = [...selectedAccomodationsMealPlans!];
                temp.splice(index, 1, v);
                setSelectedAccomodationsMealPlans(temp);
              };

              const onNightsChange = (v: string) => {
                const temp = { ...selectedAccomodationsNights! };
                temp[row.id] = v;
                setSelectedAccomodationsNights(temp);
              };

              const onPaxChange = (v: string) => {
                const temp = [...selectedAccomodationsPax!];
                temp.splice(index, 1, v);
                setSelectedAccomodationsPax(temp);
              };

              const onAdditionalBedChange = (v: string) => {
                const temp = [...selectedAccomodationsAdditionalBed!];
                temp.splice(index, 1, v);
                setSelectedAccomodationsAdditionalBed(temp);
              };

              return (
                <TableRow key={index + 100}>
                  <TableRowTextCell
                    cell={{
                      align: 'center',
                      title: row.isSubEntry ? '' : row.country,
                      colors: ['#464E5F'],
                      weight: 400,
                    }}
                  />
                  <TableRowTextCell
                    cell={{
                      align: 'center',
                      title: row.isSubEntry ? '' : row.city,
                      colors: ['#464E5F'],
                      weight: 400,
                    }}
                  />
                  {!preset && (
                    row.isSubEntry ? (
                      <TableRowTextCell
                        cell={{
                          align: 'center',
                          title: '',
                          colors: ['#464E5F'],
                          weight: 400,
                        }}
                      />
                    ) : (
                      <TableRowEditCell
                        type="Nights"
                        select={false}
                        value={selectedAccomodationsNights![row.id] || ''}
                        onCountChange={onNightsChange}
                        align="center"
                      />
                    )
                  )}
                  <TableRowTextCell
                    cell={{
                      align: 'center',
                      title: row.isSubEntry ? '' : row.accomodationType,
                      colors: ['#464E5F'],
                      weight: 400,
                    }}
                  />
                  <TableRowTextCell
                    cell={{
                      align: 'center',
                      title: row.isSubEntry ? '' : row.name,
                      colors: ['#464E5F'],
                      weight: 400,
                    }}
                  />
                  {!preset && (
                    row.isMultiple ? (
                      <TableRowEditCell
                        select
                        type="Pax"
                        value={selectedAccomodationsPax![index] || ''}
                        onSelectChange={onPaxChange}
                        options={paxOptions}
                        align="center"
                      />
                    ) : (
                      <TableRowTextCell
                        cell={{
                          align: 'center',
                          title: selectedAccomodationsPax![index] || '',
                          colors: ['#464E5F'],
                          weight: 400,
                        }}
                      />
                    )
                  )}
                  <TableRowEditCell
                    select
                    type="Additional Bed"
                    value={selectedAccomodationsAdditionalBed![index] || ''}
                    onSelectChange={onAdditionalBedChange}
                    options={addBedOptions}
                    align="center"
                  />
                  <TableRowEditCell
                    select
                    type="Room Type"
                    value={selectedAccomodationsRoomTypes![index] || ''}
                    onSelectChange={onRoomTypeChange}
                    options={allRoomTypes}
                    align="center"
                  />
                  <TableRowEditCell
                    select
                    type="Meal Plan"
                    value={selectedAccomodationsMealPlans![index] || ''}
                    onSelectChange={onMealPlanChange}
                    options={mealPlans}
                    align="center"
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
