// helpers
const mainContainerStyles = {
  container: {
    display: 'flex',
    padding: '1rem',
    backgroundColor: '#E5E5E5',
  },
  innerContainer: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    padding: '1rem',
    flex: 1,
    overflowX: 'hidden' as const,
    overflowY: 'scroll' as const,
  },
};

const shadowButtonStyles = {
  color: 'white',
  backgroundColor: '#6296E4',
  borderRadius: '0.5rem',
  fontWeight: 600,
  filter: 'drop-shadow(5px 5px 4px rgba(0, 0, 0, 0.25))',
};

const formCreateMemberStyles = {
  header: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    margin: '0px',
    color: '#0A65FF',
    fontSize: '1rem',
  },
  subtitle: {
    margin: '0px',
    color: '#C1BFBF',
    fontSize: '1.1rem',
  },
  formContainer: {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  tableContainer: {
    padding: '0 1rem',
  },
  multiFieldContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  multiFieldDialogContainer: {
    width: '500px',
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '1rem 24px',
  },
  addBtnContainer: {
    margin: '2rem 1rem 0 0',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  backBtn: {
    color: '#0A65FF',
    padding: '1rem',
  },
  radioBtnContainer: {
    display: 'flex',
    margin: '0 1rem',
    flexDirection: 'row' as const,
  },
  singleCheckbox: {
    marginTop: '1rem',
  },
  errorMsg: {
    color: 'red',
    textAlign: 'center' as const,
  },
  addBtn: shadowButtonStyles,
  phoneNumberInput: {
    flex: 1,
    outline: 'none',
  },
};

export const TableToolbarStyles = {
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toolbarContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  search: {
    padding: '4px',
  },
  deleteIcon: {
    padding: '0px 8px 0px 0px',
    color: 'red',
  },
  filterIcon: {
    padding: '0px 8px 0px 0px',
    color: '#0A65FF',
  },
  addBtn: {
    color: 'white',
    backgroundColor: '#0A65FF',
    borderRadius: '0.5rem',
    margin: '0px',
  },
};

export const fetchingDataIndicatorStyles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

// Login
export const loginStyles = {
  ...formCreateMemberStyles,
  title: {
    fontWeight: 'bolder',
    fontSize: '2rem',
    marginBottom: '0rem',
    marginTop: '0rem',
  },
  subtitle: {
    ...formCreateMemberStyles.subtitle,
    fontweight: 'lighter',
    marginBottom: '1rem',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '2rem 2rem',
    backgroundColor: 'white',
    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
    borderRadius: '0.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  inputs: {
    padding: '0.7rem 0.5rem',
  },
  loginBtn: {
    ...formCreateMemberStyles.addBtn,
    marginTop: '1rem',
  },
  wrapper: {
    backgroundColor: '#A0C6F4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
};

// User Profile
export const userProfileStyles = {
  ...formCreateMemberStyles,
  ...mainContainerStyles,
};

// Quotations
export const quotationsStyles = {
  ...mainContainerStyles,
  btnMainContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: '2rem',
  },
  btnSubContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  },
  dataCardContainer: {
    display: 'flex',
    marginBottom: '4rem',
    justifyContent: 'space-between',
    flexWrap: 'wrap' as const,
  },
  btnSubInnerContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    flex: 1,
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flex: 1,
  },
  btn: {
    ...shadowButtonStyles,
    width: '11rem',
  },
};

export const quoteCreateQuoteStyles = {
  ...formCreateMemberStyles,
  ...quotationsStyles,
  searchBar: {
    wrapper: {
      height: '350px',
      overflowY: 'scroll' as const,
      marginTop: '1rem',
    },
    mainContainer: {
      display: 'flex',
    },
    sidebarContainer: {
      padding: '1rem',
    },
    checkboxSectionContainer: {
      container: {
        display: 'flex',
        flexDirection: 'column' as const,
      },
      title: {
        color: '#0A65FF',
        fontWeight: 'bold',
      },
    },
    accomodationContainer: {
      container: {
        flex: 1,
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column' as const,
      },
      card: {
        titleContainer: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: 0,
        },
        location: {
          margin: 0,
          fontStyle: 'italic',
          fontWeight: '400',
        },
        bookingEngine: {
          color: 'blue',
          fontWeight: '400',
          margin: 0,
        },
        costContainer: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
        label: {
          color: '#0A65FF',
          textAlign: 'left' as const,
          fontWeight: 'bold',
        },
      },
    },
  },
};

// Voucher
export const voucherStyles = {
  ...mainContainerStyles,
  ...quoteCreateQuoteStyles,
  voucherTemplate: {
    summaryDetails: {
      mainContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        borderBottom: '2px solid #41E93E',
        padding: '1rem',
      },
      multiTableContainer: {
        padding: '1rem',
      },
      detailContainer: {
        width: '250px',
        display: 'flex',
        justifyContent: 'space-between',
        margin: 0,
      },
      label: {
        color: '#1C5BBA',
      },
      detail: {
        fontWeight: 'bold',
        textAlign: 'right' as const,
      },
    },
    cashReceipt: {
      mainContainer: {
        padding: '1rem',
        borderBottom: '2px solid #41E93E',
      },
      detailContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-start',
        margin: '1rem 0',
      },
      label: {
        color: '#1C5BBA',
        width: '550px',
      },
      detail: {
        fontWeight: 'bold',
      },
    },
  },
};

// Summary
export const summaryStyles = {
  ...mainContainerStyles,
  ...quoteCreateQuoteStyles,
  ...voucherStyles,
  sectionTitle: {
    color: '#0A65FF',
    fontSize: '1.3rem',
    fontWeight: 'bold',
  },
  tableOverallRates: {
    detailContainer: {
      width: 'auto',
      display: 'flex',
      justifyContent: 'flex-end',
    },
    label: {
      color: '#1C5BBA',
      width: '150px',
      textAlign: 'left' as const,
    },
    usdValue: {
      width: 'auto',
      minWidth: '100px',
      textAlign: 'right' as const,
      fontWeight: 'bold',
    },
    lkrValue: {
      width: 'auto',
      minWidth: '100px',
      textAlign: 'right' as const,
      fontWeight: 'bold',
    },
  },
};

/// Quotations - Approval
export const approvalStyles = {
  titleText: {
    color: '#1C5BBA',
    margin: 0,
    fontWeight: 'bold',
  },
  banner: {
    text: {
      color: '#1C5BBA',
      margin: 0,
    },
    mainContainer: {
      display: 'flex',
      borderBottom: '2px solid #41E93E',
      paddingBottom: '1rem',
    },
    contentContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      padding: '1rem',
      justifyContent: 'space-between',
    },
    social: {
      display: 'flex',
    },
  },
  guestDetails: {
    container: {
      display: 'flex',
      justifyContent: 'space-between',
      borderBottom: '2px solid #41E93E',
      padding: '1rem',
    },
    costContainer: {
      container: {
        width: '200px',
        display: 'flex',
        justifyContent: 'space-between',
        margin: 0,
      },
      label: {
        color: '#1C5BBA',
      },
      cost: {
        fontWeight: 'bold',
      },
    },
  },
  rates: {
    titleContainer: {
      display: 'flex',
      alignItems: 'center',
      marginTop: '2rem',
    },
  },
  overallCost: {
    container: {
      marginTop: '1rem',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'flex-end',
      padding: '0 1rem',
      borderBottom: '2px solid #41E93E',
    },
    costContainer: {
      container: {
        width: '200px',
        display: 'flex',
        justifyContent: 'space-between',
        margin: 0,
      },
      netPriceContainer: {
        width: '200px',
        display: 'flex',
        justifyContent: 'space-between',
        borderTop: '1px solid #41E93E',
        borderBottom: '1px solid #41E93E',
        padding: '0.5rem 0',
      },
      label: {
        color: '#1C5BBA',
      },
      cost: {
        fontWeight: 'bold',
      },
    },
  },
  offers: {
    container: {
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column' as const,
      borderBottom: '2px solid #41E93E',
    },
  },
};

// Library
export const libraryStyles = {
  ...mainContainerStyles,
  btn: {
    ...shadowButtonStyles,
    width: '11rem',
  },
  textField: {
    width: '11rem',
  },
  btnContainer: {
    justifyContent: 'flex-start',
    marginBottom: '4rem',
    display: 'flex',
  },
};

export const libraryTableStyles = {
  activeUsers: {
    fontSize: '1rem',
    color: '#606F89',
    fontWeight: 600,
  },
  totalUsers: {
    fontSize: '0.7rem',
    color: '#606F89',
  },
};

export const libraryAccomodationStyles = {
  ...formCreateMemberStyles,
};

export const libraryDriverStyles = {
  ...formCreateMemberStyles,
};

export const libraryCreateGuestStyles = {
  ...formCreateMemberStyles,
  addBtnContainer: {
    ...formCreateMemberStyles.addBtnContainer,
    justifyContent: 'space-between',
  },
  subtitle: {
    color: '#C1BFBF',
    fontSize: '1.3rem',
    margin: 0,
  },
};

// Dashboard
export const dashboardStyles = {
  ...quotationsStyles,
  ...formCreateMemberStyles,
  mainContainer: {
    overflow: 'scroll',
  },
};

// Compare Rates
export const compareRatesStyles = {
  ...quotationsStyles,
  ...formCreateMemberStyles,
  mainContainer: {
    overflow: 'scroll',
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  toolsContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  detailsContainer: {
    display: 'flex',
    flexWrap: 'wrap' as const,
  },
};

// Settings
export const settingsStyles = {
  ...quotationsStyles,
  ...formCreateMemberStyles,
};

// Utilities
export const guestProfileStyles = {
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    margin: '8px',
    height: '30px',
    width: '30px',
  },
  innerContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  paragraph: {
    margin: '0px',
    fontSize: '0.875rem',
  },
};

export const headerStyles = {
  container: {
    backgroundColor: '#C1BFBF',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '1rem',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },
  userProfile: {
    display: 'flex',
    justifyContent: 'flex-end',
    flex: 1,
    paddingRight: '1rem',
  },
  avatar: {
    marginRight: '20px',
    height: '30px',
    width: '30px',
  },
  spanI: {
    marginRight: '12px',
    fontWeight: 500,
    color: '#1C5BBA',
    fontSize: '40px',
  },
  spanT: {
    margin: '0px',
    fontWeight: 500,
    color: '#41E93E',
    fontSize: '32px',
  },
};

export const navbarStyles = {
  container: {
    display: 'flex',
    width: '100%',
    height: '3rem',
    backgroundColor: '#4283e4',
  },
  link: {
    padding: '0px 10px',
    margin: '0px 10px',
  },
  logoutBtn: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1rem',
    padding: 0,
  },
};

export const tableRowTextCellStyles = {
  paragraph: {
    margin: '0px',
    fontSize: '0.875rem',
  },
};

export const tableRowCheckboxCellStyles = {
  display: 'flex',
  alignItems: 'center',
};

export const DataCardStyles = {
  title: {
    color: '#9FA2B4',
    fontWeight: 'bold',
    margin: '0',
    textAlign: 'center' as const,
  },
  total: {
    fontWeight: 'bold',
    fontSize: '3rem',
    margin: '0',
    textAlign: 'center' as const,
  },
};
