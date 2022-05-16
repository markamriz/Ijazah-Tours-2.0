import { useEffect, useState } from 'react';

import { CircularProgress } from '@material-ui/core';
import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import ButtonAtom from '../../atoms/ButtonAtom';
import DivAtom from '../../atoms/DivAtom';
import { db } from '../../firebase';
import TaskTable from '../../organisms/dashboard/TaskTable';
import { selectWithoutNavbarHeight, selectWithoutNavbarWidth } from '../../redux/containerSizeSlice';
import { selectUser } from '../../redux/userSlice';
import { dashboardStyles, fetchingDataIndicatorStyles } from '../../styles';
import { widthHeightDynamicStyle } from '../../utils/helpers';

function Dashboard() {
  const user = useSelector(selectUser);
  const height = useSelector(selectWithoutNavbarHeight);
  const width = useSelector(selectWithoutNavbarWidth);

  const [dashboardData, setDashboardData] = useState<any>();
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const getIntialDashboardData = async () => {
      const data = (await getDocs(collection(db, 'Dashboard Tasks'))).docs;
      const tasks = data.map((dc) => dc.data());
      const ids = data.map((dc) => dc.id);
      ids.forEach((id, i) => {
        tasks[i].id = id;
      });

      const filteredTasks = tasks.filter((t) => t.creator.id === user.id);

      const groupedTaskhData = _.groupBy(
        filteredTasks,
        (task: { refNum: string }) => task.refNum,
      );

      setDashboardData(groupedTaskhData);
    };

    getIntialDashboardData();
  }, []);

  const onUpdateTaskStatus = async () => {
    setIsUpdating(true);
    await updateTaskStatus();
    setIsUpdating(false);
  };

  const updateTaskStatus = async () => {
    Object.keys(dashboardData).forEach(async (refNum) => {
      await dashboardData[refNum].forEach(async (task: any) => {
        const { id, ...t } = task;
        await setDoc(doc(db, 'Dashboard Tasks', id), {
          ...t,
          updatedAt: serverTimestamp(),
        });
      });
    });
  };

  return (
    <DivAtom style={dashboardStyles.container}>
      <DivAtom
        style={{
          ...dashboardStyles.innerContainer,
          ...dashboardStyles.mainContainer,
          height: `${height}px`,
        }}
      >
        <DivAtom style={dashboardStyles.btnMainContainer}>
          <Link to="/library/guest/create">
            <ButtonAtom
              text="Create Customer"
              style={{
                ...dashboardStyles.btn,
                marginRight: '16px',
              }}
              onClick={() => null}
              size="large"
            />
          </Link>
        </DivAtom>
        {dashboardData ? (
          <>
            <DivAtom>
              <TaskTable
                columns={['Task Name', 'Quotation Title', 'Status', '']}
                dashboardData={dashboardData}
                setDashboardData={setDashboardData}
              />
            </DivAtom>
            <ButtonAtom
              endIcon={isUpdating && <CircularProgress size={20} color="inherit" />}
              size="large"
              disabled={isUpdating}
              text="Update"
              onClick={onUpdateTaskStatus}
              style={{
                ...dashboardStyles.addBtn,
                width: widthHeightDynamicStyle(width, 768, '100%', '18%'),
                marginTop: '1rem',
              }}
            />
          </>
        ) : (
          <DivAtom style={fetchingDataIndicatorStyles.container}>
            <CircularProgress size={20} color="primary" />
          </DivAtom>
        )}
      </DivAtom>
    </DivAtom>
  );
}

export default Dashboard;
