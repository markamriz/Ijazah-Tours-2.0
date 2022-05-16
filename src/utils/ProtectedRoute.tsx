import { ReactNode } from 'react';

import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

import { selectUser } from '../redux/userSlice';
import { roleOptions } from './helpers';

interface ProtectedRouteProps {
  path: string;
  children: ReactNode;
  admin?: boolean;
  exact?: boolean;
}

function ProtectedRoute({
  path,
  admin,
  exact,
  children,
}: ProtectedRouteProps) {
  const user = useSelector(selectUser);

  const AdminPath = (
    user.email !== '' && user.role === roleOptions[0].value ? children : <Redirect to="/login" />
  );

  const TravelAgentPath = (
    user.email !== '' ? children : <Redirect to="/login" />
  );

  return (
    !admin ? (
      <Route exact={exact} path={path}>
        {TravelAgentPath}
      </Route>
    ) : (
      <Route exact={exact} path={path}>
        {AdminPath}
      </Route>
    )
  );
}

export default ProtectedRoute;
