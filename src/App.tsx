import { useEffect, useLayoutEffect, useState } from 'react';

import { CircularProgress } from '@material-ui/core';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import {
  Redirect,
  Route,
  Switch,
  useHistory,
} from 'react-router-dom';
import styled from 'styled-components';

import DivAtom from './atoms/DivAtom';
import GlobalStyle from './globalStyle';
import Header from './organisms/Header';
import Navbar from './organisms/Navbar';
import Sidebar from './organisms/Sidebar';
import CompareRates from './pages/compare-rates/CompareRates';
import Dashboard from './pages/dashboard/Dashboard';
import Accomodation from './pages/library/accomodation/Accomodation';
import Driver from './pages/library/driver/Driver';
import Guest from './pages/library/guest/Guest';
import Login from './pages/login/Login';
import UserProfile from './pages/profile/UserProfile';
import Quotations from './pages/quote/quotation/Quotations';
import Summary from './pages/quote/summary/Summary';
import Voucher from './pages/quote/voucher/Voucher';
import SettingsAccomodation from './pages/settings/accomodation/SettingsAccomodation';
import General from './pages/settings/general/General';
import Tour from './pages/settings/tour/Tour';
import UserManagement from './pages/settings/user-management/UserManagement';
import { onSizeChange } from './redux/containerSizeSlice';
import { login, logout } from './redux/userSlice';
import { fetchingDataIndicatorStyles } from './styles';
import { getUserOnLogin, handleClientLoad, widthHeightDynamicStyle } from './utils/helpers';
import ProtectedRoute from './utils/ProtectedRoute';

const rememberMe = localStorage.getItem('Ijazah Remember Me') !== 'false';

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [getInitialUser, setGetInitialUser] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    handleClientLoad();
  }, []);

  useEffect(() => {
    if (rememberMe) {
      onAuthStateChanged(getAuth(), async (usr) => {
        if (usr) {
          setGetInitialUser(false);
          const userData = await getUserOnLogin(usr);
          dispatch(login(userData));
          setGetInitialUser(true);
        } else {
          setGetInitialUser(false);
          dispatch(logout());
          setGetInitialUser(true);
        }
      });
    } else {
      const onLogout = async () => {
        setGetInitialUser(false);
        await signOut(getAuth());
        dispatch(logout());
        setGetInitialUser(true);
      };

      onLogout();
    }
  }, []);

  useEffect(() => {
    history?.listen((location) => {
      if (location.pathname !== '/quote/quotations/create/customer'
        && location.pathname !== '/quote/quotations/create/accomodation'
        && location.pathname !== '/quote/quotations/create/costing'
        && location.pathname !== '/quote/quotations/create/approval') {
        localStorage.removeItem('New Quote Customer');
        localStorage.removeItem('New Quote Accomodation');
      }

      if (location.pathname !== '/quote/quotations/create/preset/holiday'
        && location.pathname !== '/quote/quotations/create/preset/accomodation') {
        localStorage.removeItem('New Preset Quote');
      }
    });
  }, []);

  useLayoutEffect(() => {
    dispatchContainerSize();

    const widthListener = window.addEventListener('resize', () => {
      dispatchContainerSize();
    });
    const heightListener = window.addEventListener('resize', () => {
      dispatchContainerSize();
    });

    const removeEventListeners = () => {
      window.removeEventListener('resize', heightListener as any);
      window.removeEventListener('resize', widthListener as any);
    };

    return removeEventListeners();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const dispatchContainerSize = () => {
    dispatch(
      onSizeChange({
        withNavbarWidth: window.innerWidth,
        with2NavbarWidth: window.innerWidth,
        withoutNavbarWidth: window.innerWidth,
        withNavbarHeight: widthHeightDynamicStyle(
          window.innerWidth,
          1400,
          window.innerHeight - 170,
          window.innerHeight - 160,
        ) as number,
        with2NavbarHeight: widthHeightDynamicStyle(
          window.innerWidth,
          1400,
          window.innerHeight - 220,
          window.innerHeight - 210,
        ) as number,
        withoutNavbarHeight: widthHeightDynamicStyle(
          window.innerWidth,
          1400,
          window.innerHeight - 120,
          window.innerHeight - 110,
        ) as number,
      }),
    );
  };

  return (
    <>
      <GlobalStyle />
      {getInitialUser ? (
        <Switch>
          <ProtectedRoute path="/dashboard">
            <>
              <Header handleDrawerToggle={handleDrawerToggle} />
              <Root>
                <Sidebar
                  mobileOpen={mobileOpen}
                  handleDrawerToggle={handleDrawerToggle}
                />
                <StyledDivAtom>
                  <Dashboard />
                </StyledDivAtom>
              </Root>
            </>
          </ProtectedRoute>
          <ProtectedRoute path="/user-profile">
            <>
              <Header handleDrawerToggle={handleDrawerToggle} />
              <Root>
                <Sidebar
                  mobileOpen={mobileOpen}
                  handleDrawerToggle={handleDrawerToggle}
                />
                <StyledDivAtom>
                  <UserProfile />
                </StyledDivAtom>
              </Root>
            </>
          </ProtectedRoute>
          <ProtectedRoute path="/quote">
            <Header handleDrawerToggle={handleDrawerToggle} />
            <Root>
              <Sidebar
                mobileOpen={mobileOpen}
                handleDrawerToggle={handleDrawerToggle}
              />
              <StyledDivAtom>
                <Navbar type="quote" />
                <ProtectedRoute path="/quote/quotations">
                  <Quotations />
                </ProtectedRoute>
                <ProtectedRoute path="/quote/voucher">
                  <Voucher />
                </ProtectedRoute>
                <ProtectedRoute path="/quote/summary/:id">
                  <Summary />
                </ProtectedRoute>
                <ProtectedRoute exact path="/quote">
                  <Redirect to="/quote/quotations" />
                </ProtectedRoute>
              </StyledDivAtom>
            </Root>
          </ProtectedRoute>
          <ProtectedRoute path="/library">
            <Header handleDrawerToggle={handleDrawerToggle} />
            <Root>
              <Sidebar
                mobileOpen={mobileOpen}
                handleDrawerToggle={handleDrawerToggle}
              />
              <StyledDivAtom>
                <Navbar type="library" />
                <ProtectedRoute path="/library/accomodation">
                  <Accomodation />
                </ProtectedRoute>
                <ProtectedRoute path="/library/driver">
                  <Driver />
                </ProtectedRoute>
                <ProtectedRoute path="/library/guest">
                  <Guest />
                </ProtectedRoute>
                <ProtectedRoute exact path="/library">
                  <Redirect to="/library/accomodation" />
                </ProtectedRoute>
              </StyledDivAtom>
            </Root>
          </ProtectedRoute>
          <ProtectedRoute path="/compare-rates">
            <Header handleDrawerToggle={handleDrawerToggle} />
            <Root>
              <Sidebar
                mobileOpen={mobileOpen}
                handleDrawerToggle={handleDrawerToggle}
              />
              <StyledDivAtom>
                <CompareRates />
              </StyledDivAtom>
            </Root>
          </ProtectedRoute>
          <ProtectedRoute admin path="/settings">
            <Header handleDrawerToggle={handleDrawerToggle} />
            <Root>
              <Sidebar
                mobileOpen={mobileOpen}
                handleDrawerToggle={handleDrawerToggle}
              />
              <StyledDivAtom>
                <Navbar type="settings" />
                <ProtectedRoute path="/settings/accomodation">
                  <SettingsAccomodation />
                </ProtectedRoute>
                <ProtectedRoute path="/settings/tour">
                  <Tour />
                </ProtectedRoute>
                <ProtectedRoute path="/settings/user-management">
                  <UserManagement />
                </ProtectedRoute>
                <ProtectedRoute path="/settings/general">
                  <General />
                </ProtectedRoute>
                <Route exact path="/settings">
                  <Redirect to="/settings/user-management" />
                </Route>
              </StyledDivAtom>
            </Root>
          </ProtectedRoute>

          <Route path="/login">
            <StyledDivAtom isFullScreen>
              <Login />
            </StyledDivAtom>
          </Route>
          <Route exact path="/">
            <StyledDivAtom isFullScreen>
              <Login />
            </StyledDivAtom>
          </Route>
        </Switch>
      ) : (
        <DivAtom
          style={{
            ...fetchingDataIndicatorStyles.container,
            height: '100vh',
          }}
        >
          <CircularProgress size={50} color="primary" />
        </DivAtom>
      )}
    </>
  );
}

export default App;

interface StyledDivProps {
  isFullScreen?: boolean;
}

const Root = styled.div`
  display: flex;
  flex: 1;
`;

const StyledDivAtom = styled.div<StyledDivProps>`
  display: flex;
  width: 100%;
  flex-direction: column;
  overflow-x: scroll;

  ${({ isFullScreen }) => isFullScreen && fullScreenOverflowStyle}

  > div:nth-child(2) {
    flex: 1;
  }
`;

const fullScreenOverflowStyle = `
  overflow: visible;
`;
