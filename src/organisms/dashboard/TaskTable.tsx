import {
  ChangeEvent,
  Fragment,
  useEffect,
  useState,
} from 'react';

import { Box, Collapse } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';

import TableColumnCell from '../../molecules/TableColumnCell';
import TableRowButtonCell from '../../molecules/TableRowButtonCell';
import TableRowCheckboxCell from '../../molecules/TableRowCheckboxCell';
import TableRowIconCell from '../../molecules/TableRowIconCell';

interface TaskTableProps {
  columns: string[];
  dashboardData: any[];
  setDashboardData: any;
}

interface RowProps {
  index: number;
  row: any;
  dashboardData: any[];
  setDashboardData: any;
}

function Row({
  row,
  index,
  dashboardData,
  setDashboardData,
}: RowProps) {
  const [open, setOpen] = useState(false);
  const [rowChecked, setRowChecked] = useState(
    row.status === 'COMPLETE'
    || row.every((task: { completed: boolean }) => task.completed === true),
  );

  const [tasksChecked, setTasksChecked] = useState(
    row.map((task: { completed: boolean }) => task.completed === true),
  );

  useEffect(() => {
    getOverallRowStatus();
  }, []);

  const keyboardIcon = open ? (
    <KeyboardArrowDownIcon />
  ) : (
    <KeyboardArrowLeftIcon />
  );

  const onChangeRowStatus = (e: ChangeEvent<HTMLInputElement>) => {
    const { refNum } = row[0];
    const tempUpdatedDashboardData = { ...dashboardData };
    const tempUpdatedRowData = tempUpdatedDashboardData[refNum].map((task: any) => (
      { ...task, completed: e.target.checked }
    ));
    tempUpdatedDashboardData[refNum] = tempUpdatedRowData;

    setDashboardData(tempUpdatedDashboardData);
    setRowChecked(e.target.checked);
    setTasksChecked(tasksChecked.map((checked: boolean) => !checked));
  };

  const onChangeTaskStatus = (
    e: ChangeEvent<HTMLInputElement>,
    i: number,
  ) => {
    const { refNum } = row[0];
    const tempUpdatedDashboardData = { ...dashboardData };
    const tempUpdatedRowData = [...tempUpdatedDashboardData[refNum]];
    tempUpdatedRowData.splice(i, 1, {
      ...row[i],
      completed: e.target.checked,
    });
    tempUpdatedDashboardData[refNum] = tempUpdatedRowData;

    const tempChecked = [...tasksChecked];
    tempChecked[i] = e.target.checked;

    setDashboardData(tempUpdatedDashboardData);
    setTasksChecked(tempChecked);
    setRowChecked(tempChecked.every((t: boolean) => t === true));
    getOverallRowStatus();
  };

  const getOverallRowStatus = () => {
    let status = 'COMPLETE';
    tasksChecked.forEach((checked: boolean) => {
      if (!checked) {
        status = 'TODO';
      }
    });

    return status;
  };

  const getStatusBtnColors = () => (
    getOverallRowStatus() === 'COMPLETE' ? ['#29CC97', '#ffffff'] : ['#7879F1', '#ffffff']
  );

  return (
    <Fragment>
      <TableRow>
        <TableRowCheckboxCell
          name={row[0].refNum}
          checked={rowChecked}
          onChange={onChangeRowStatus}
          align="left"
        />
        <TableCell>{row[0].title}</TableCell>
        <TableRowButtonCell
          key={index}
          onClick={() => null}
          align="left"
          btnWidth="8rem"
          btnSize="small"
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
                    <TableColumnCell color="black" column="Task Name" />
                    <TableColumnCell color="black" column="Quotation Title" />
                    <TableColumnCell color="black" column="Status" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.map((task: any, i: number) => (
                    <TableRow key={task.id}>
                      <TableRowCheckboxCell
                        name={task.status}
                        checked={tasksChecked[i]}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => onChangeTaskStatus(e, i)}
                        align="left"
                      />
                      <TableCell>{task.title}</TableCell>
                      <TableRowButtonCell
                        key={i}
                        onClick={() => null}
                        align="left"
                        btnWidth="8rem"
                        btnSize="small"
                        btnBorderRadius="0.5rem"
                        btnText={task.stage}
                        btnColors={['#29CC97', '#ffffff']}
                        btnDisabled
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

export default function TaskTable({
  columns,
  dashboardData,
  setDashboardData,
}: TaskTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableColumnCell key={index} color="b5b5c3" column={column} />
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(dashboardData).map((row: any, index) => (
            <Row
              key={index}
              row={dashboardData[row]}
              index={index}
              dashboardData={dashboardData}
              setDashboardData={setDashboardData}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
