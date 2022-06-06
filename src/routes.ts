import Dashboard from './pages/dashboard/Dashboard';
import Accomodation from './pages/library/accomodation/Accomodation';
import Driver from './pages/library/driver/Driver';
import Guest from './pages/library/guest/Guest';
import Quotations from './pages/quote/quotation/Quotations';
import Summary from './pages/quote/summary/Summary';
import Voucher from './pages/quote/voucher/Voucher';
import SettingsAccomodation from './pages/settings/accomodation/SettingsAccomodation';
import Tour from './pages/settings/tour/Tour';
import UserManagement from './pages/settings/user-management/UserManagement';

export const GetRoutes = () => ([
  {
    path: RoutePaths.Dashboard,
    exact: true,
    component: Dashboard,
    protected: true,
    nested: false,
  },
  {
    nested: true,
    main: RoutePaths.quotation.Main,
    redirectExact: RoutePaths.quotation.Quotations,
    nestedRoutes: [
      {
        path: RoutePaths.quotation.Quotations,
        exact: true,
        component: Quotations,
        protected: true,
      },
      {
        path: RoutePaths.quotation.Voucher,
        exact: true,
        component: Voucher,
        protected: true,
      },
      {
        path: RoutePaths.quotation.Summary,
        exact: true,
        component: Summary,
        protected: true,
      },
    ],
  },
  {
    nested: true,
    main: RoutePaths.library.Main,
    redirectExact: RoutePaths.library.Accomodation,
    nestedRoutes: [
      {
        path: RoutePaths.library.Accomodation,
        exact: true,
        component: Accomodation,
        protected: true,
      },
      {
        path: RoutePaths.library.Driver,
        exact: true,
        component: Driver,
        protected: true,
      },
      {
        path: RoutePaths.library.Guest,
        exact: true,
        component: Guest,
        protected: true,
      },
    ],
  },
  {
    nested: true,
    main: RoutePaths.settings.Main,
    redirectExact: RoutePaths.settings.UserManagement,
    nestedRoutes: [
      {
        path: RoutePaths.settings.SettingsAccomodation,
        exact: true,
        component: SettingsAccomodation,
        protected: true,
      },
      {
        path: RoutePaths.settings.Tour,
        exact: true,
        component: Tour,
        protected: true,
      },
      {
        path: RoutePaths.settings.UserManagement,
        exact: true,
        component: UserManagement,
        protected: true,
      },
    ],
  },
]);

const RoutePaths = {
  Dashboard: '/dashboard',
  quotation: {
    Main: '/quote',
    Quotations: '/quote/quotations',
    Voucher: '/quote/voucher',
    Summary: '/quote/summary/:id',
  },
  library: {
    Main: '/library',
    Accomodation: '/library/accomodation',
    Driver: '/library/driver',
    Guest: '/library/guest',
  },
  settings: {
    Main: '/settings',
    SettingsAccomodation: '/settings/accomodation',
    Tour: '/settings/tour',
    UserManagement: '/settings/user-management',
    General: '/settings/general',
  },
};
