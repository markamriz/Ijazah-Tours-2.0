import { ChangeEvent, useEffect, useState } from 'react';

import { CircularProgress } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { collection, getDocs } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { Link, Route } from 'react-router-dom';

import ButtonAtom from '../../../atoms/ButtonAtom';
import DivAtom from '../../../atoms/DivAtom';
import InputAtom from '../../../atoms/InputAtom';
import TextFieldAtom from '../../../atoms/TextFieldAtom';
import { db } from '../../../firebase';
import DataCard from '../../../molecules/DataCard';
import CreateQuotationNavbar from '../../../organisms/quote/quotation/CreateQuotationNavbar';
import QuotationsTable from '../../../organisms/quote/quotation/QuotationsTable';
import { selectWithNavbarHeight, selectWithNavbarWidth } from '../../../redux/containerSizeSlice';
import { selectUser } from '../../../redux/userSlice';
import { fetchingDataIndicatorStyles, libraryStyles, quotationsStyles } from '../../../styles';
import { roleOptions, searchData, widthHeightDynamicStyle } from '../../../utils/helpers';
import { CustomerQuotation, FlexDirection, JustifyContent } from '../../../utils/types';
import CreateAccomodation from './create-quotation/Accomodation';
import CreateApproval from './create-quotation/Approval';
import CreateCosting from './create-quotation/Costing';
import CreateCustomer from './create-quotation/Customer';
import EditAccomodation from './edit-quotation/Accomodation';
import EditApproval from './edit-quotation/Approval';
import EditCosting from './edit-quotation/Costing';
import EditCustomer from './edit-quotation/Customer';
import PresetAccomodation from './preset-qoutes/PresetAccomodation';
import PresetQuote from './preset-qoutes/PresetQuote';

function Quotations() {
  const user = useSelector(selectUser);
  const height = useSelector(selectWithNavbarHeight);
  const width = useSelector(selectWithNavbarWidth);

  const [quotationsData, setQuotationsData] = useState<CustomerQuotation[]>();

  // Keep multiple copies to not affect default states
  const [initialQuotationCardData, setInitialQuotationCardData] = useState<CustomerQuotation[]>([]);
  const [
    initialQuotationSearchData,
    setInitialQuotationSearchData,
  ] = useState<CustomerQuotation[]>([]);

  const [
    initialQuotationFilteredData,
    setInitialQuotationFilteredData,
  ] = useState<CustomerQuotation[]>([]);
  const [adminFilter, setAdminFilter] = useState(roleOptions[0].value);

  const [search, setSearch] = useState('');
  const [created, setCreated] = useState(false);
  const [cloned, setCloned] = useState(false);
  const [shared, setShared] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    searchData(search, initialQuotationSearchData, setQuotationsData);
  }, [initialQuotationSearchData, search]);

  useEffect(() => {
    const getIntialQuotationsData = async () => {
      const data = (await getDocs(collection(db, 'Approval Quotations'))).docs;
      const quotations = data.map((dc) => dc.data());
      const ids = data.map((dc) => dc.id);
      ids.forEach((id, i) => {
        quotations[i].id = id;
      });

      if (user.role === 'Travel Agent') {
        setQuotationsData((quotations as CustomerQuotation[]).filter(
          (quote) => quote.creator.id === user.id,
        ));
        setInitialQuotationCardData((quotations as CustomerQuotation[]).filter(
          (quote) => quote.creator.id === user.id,
        ));
        setInitialQuotationSearchData((quotations as CustomerQuotation[]).filter(
          (quote) => quote.creator.id === user.id,
        ));
        setInitialQuotationFilteredData((quotations as CustomerQuotation[]).filter(
          (quote) => quote.creator.id === user.id,
        ));
      } else {
        setQuotationsData((quotations as CustomerQuotation[]).filter(
          (quote) => quote.creator.role === roleOptions[0].value,
        ));
        setInitialQuotationCardData(quotations as CustomerQuotation[]);
        setInitialQuotationSearchData(quotations as CustomerQuotation[]);
        setInitialQuotationFilteredData(quotations as CustomerQuotation[]);
      }
    };

    getIntialQuotationsData();
  }, [cloned, closed, created, shared]);

  const filterApproved = () => {
    const approvedData = initialQuotationFilteredData.filter((quote) => (
      quote.status === 'APPROVED'
    ));

    setQuotationsData(approvedData);
  };

  const filterCompleted = () => {
    const completedData = initialQuotationFilteredData.filter((quote) => (
      quote.status === 'COMPLETE'
    ));

    setQuotationsData(completedData);
  };

  const filterAdmins = (val: string) => {
    if (val === roleOptions[0].value) {
      const adminData = initialQuotationFilteredData.filter((quote) => (
        quote.creator.role === roleOptions[0].value
      ));

      setQuotationsData(adminData);
    } else {
      const travelAgentData = initialQuotationFilteredData.filter((quote) => (
        quote.creator.role === roleOptions[1].value
      ));

      setQuotationsData(travelAgentData);
    }
  };

  return (
    <>
      <Route path="/quote/quotations/create">
        <DivAtom
          style={{ ...quotationsStyles.container, flexDirection: 'column' }}
        >
          <DivAtom>
            <CreateQuotationNavbar />
          </DivAtom>
          <DivAtom
            style={{
              ...quotationsStyles.innerContainer,
              height: `${height}px`,
            }}
          >
            <Route path="/quote/quotations/create/preset/holiday">
              <PresetQuote />
            </Route>
            <Route path="/quote/quotations/create/preset/accomodation">
              <PresetAccomodation />
            </Route>
            <Route path="/quote/quotations/create/customer">
              <CreateCustomer />
            </Route>
            <Route path="/quote/quotations/create/accomodation">
              <CreateAccomodation />
            </Route>
            <Route path="/quote/quotations/create/costing">
              <CreateCosting />
            </Route>
            <Route path="/quote/quotations/create/approval">
              <CreateApproval setCreated={setCreated} />
            </Route>
          </DivAtom>
        </DivAtom>
      </Route>

      <Route path="/quote/quotations/edit">
        <DivAtom
          style={{ ...quotationsStyles.container, flexDirection: 'column' }}
        >
          <DivAtom>
            <CreateQuotationNavbar />
          </DivAtom>
          <DivAtom
            style={{
              ...quotationsStyles.innerContainer,
              height: `${height}px`,
            }}
          >
            <Route path="/quote/quotations/edit/:id/customer">
              <EditCustomer />
            </Route>
            <Route path="/quote/quotations/edit/:id/accomodation">
              <EditAccomodation />
            </Route>
            <Route path="/quote/quotations/edit/:id/costing">
              <EditCosting />
            </Route>
            <Route path="/quote/quotations/edit/:id/approval">
              <EditApproval setCreated={setCreated} />
            </Route>
          </DivAtom>
        </DivAtom>
      </Route>

      <Route exact path="/quote/quotations">
        <DivAtom style={quotationsStyles.container}>
          <DivAtom
            style={{
              ...quotationsStyles.innerContainer,
              height: `${height}px`,
            }}
          >
            {(quotationsData && initialQuotationCardData) ? (
              <>
                <DivAtom
                  style={{
                    ...quotationsStyles.btnMainContainer,
                    flexDirection: widthHeightDynamicStyle(width, 768, 'column', 'row') as FlexDirection,
                  }}
                >
                  <Link to="/quote/quotations/create/customer">
                    <ButtonAtom
                      text="New Quote +"
                      style={{
                        ...quotationsStyles.btn,
                        marginRight: '16px',
                        marginBottom: widthHeightDynamicStyle(width, 768, '1rem', 0),
                        width: widthHeightDynamicStyle(width, 768, '100%', '10rem'),
                      }}
                      onClick={() => null}
                      size="large"
                    />
                  </Link>
                  <Link to="/compare-rates">
                    <ButtonAtom
                      text="Compare Rates"
                      style={{
                        ...quotationsStyles.btn,
                        marginRight: '16px',
                        marginBottom: widthHeightDynamicStyle(width, 768, '1rem', 0),
                        width: widthHeightDynamicStyle(width, 768, '100%', '10rem'),
                      }}
                      onClick={() => null}
                      size="large"
                    />
                  </Link>
                  <Link to="/quote/quotations/create/preset/holiday">
                    <ButtonAtom
                      text="Preset Quotes"
                      style={{
                        ...quotationsStyles.btn,
                        marginBottom: widthHeightDynamicStyle(width, 768, '1rem', 0),
                        width: widthHeightDynamicStyle(width, 768, '100%', '10rem'),
                      }}
                      onClick={() => null}
                      size="large"
                    />
                  </Link>
                </DivAtom>
                <DivAtom
                  style={{
                    ...quotationsStyles.dataCardContainer,
                    flexDirection: widthHeightDynamicStyle(width, 768, 'column', 'row') as FlexDirection,
                  }}
                >
                  <DataCard title="Total" total={initialQuotationCardData.length} />
                  <DataCard
                    title="Approved"
                    total={initialQuotationCardData.filter((quote) => quote.status === 'APPROVED').length}
                  />
                  <DataCard
                    title="Completed"
                    total={initialQuotationCardData.filter((quote) => quote.status === 'COMPLETE').length}
                    style={{
                      marginTop: widthHeightDynamicStyle(width, 900, '1rem', 0),
                    }}
                  />
                  <DataCard
                    title="In Progress"
                    total={initialQuotationCardData.filter((quote) => quote.status === 'IN PROGRESS').length}
                    style={{
                      marginTop: widthHeightDynamicStyle(width, 1400, '1rem', 0),
                    }}
                  />
                </DivAtom>
                <DivAtom
                  style={{
                    ...quotationsStyles.btnSubContainer,
                    flexDirection: widthHeightDynamicStyle(width, 970, 'column', 'row') as FlexDirection,
                  }}
                >
                  <DivAtom
                    style={{
                      ...quotationsStyles.btnSubInnerContainer,
                      margin: widthHeightDynamicStyle(width, 970, '0 0 1rem 0', 0),
                      flexDirection: widthHeightDynamicStyle(width, 550, 'column', 'row') as FlexDirection,
                    }}
                  >
                    {user.role === roleOptions[0].value && (
                      <TextFieldAtom
                        variant="standard"
                        size="medium"
                        label="Quotes of"
                        value={adminFilter}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                          setAdminFilter(e.target.value);
                          filterAdmins(e.target.value);
                        }}
                        options={roleOptions}
                        adornmentPosition="end"
                        style={{
                          ...libraryStyles.textField,
                          flex: 1,
                          width: widthHeightDynamicStyle(width, 550, '100%', 'auto'),
                          margin: widthHeightDynamicStyle(width, 550, '0 0 1rem 0', '0 1rem 0 0'),
                        }}
                        disableUnderline={false}
                        select
                      />
                    )}
                    <ButtonAtom
                      text="Approved"
                      style={{
                        ...quotationsStyles.btn,
                        margin: widthHeightDynamicStyle(width, 550, '0 0 1rem 0', '0 1rem 0 0'),
                      }}
                      onClick={filterApproved}
                      size="large"
                    />
                    <ButtonAtom
                      text="Complete"
                      style={quotationsStyles.btn}
                      onClick={filterCompleted}
                      size="large"
                    />
                  </DivAtom>
                  <DivAtom
                    style={{
                      ...quotationsStyles.searchContainer,
                      justifyContent: widthHeightDynamicStyle(width, 768, 'flex-start', 'flex-end') as JustifyContent,
                    }}
                  >
                    <InputAtom
                      placeholder="Search"
                      adornmentPosition="start"
                      fullWidth={width < 768}
                      value={search}
                      plain="false"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)
                      }
                      children={<SearchIcon />}
                    />
                  </DivAtom>
                </DivAtom>
                <QuotationsTable
                  rowdata={quotationsData}
                  setCloned={setCloned}
                  setShared={setShared}
                  setClosed={setClosed}
                />
              </>
            ) : (
              <DivAtom style={fetchingDataIndicatorStyles.container}>
                <CircularProgress size={20} color="primary" />
              </DivAtom>
            )}
          </DivAtom>
        </DivAtom>
      </Route>
    </>
  );
}

export default Quotations;
