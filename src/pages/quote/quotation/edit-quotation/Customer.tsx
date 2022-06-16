import {
  useEffect, useState, MouseEvent,
} from 'react';

import { CircularProgress } from '@material-ui/core';
import ChevronLeftRoundedIcon from '@material-ui/icons/ChevronLeftRounded';
import {
  collection,
  getDocs,
} from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

import DivAtom from '../../../../atoms/DivAtom';
import H2Atom from '../../../../atoms/H2Atom';
import IconAtom from '../../../../atoms/IconAtom';
import { db } from '../../../../firebase';
import CustomerForm from '../../../../organisms/quote/quotation/create-quotation/customer/CustomerForm';
import { selectWith2NavbarHeight, selectWith2NavbarWidth } from '../../../../redux/containerSizeSlice';
import {
  fetchingDataIndicatorStyles,
  quoteCreateQuoteStyles,
} from '../../../../styles';
import { dateTypeOptions, getDaysDifference, mealPlanOptions } from '../../../../utils/helpers';
import { DropdownOption, LibraryGuest, SettingsLocation } from '../../../../utils/types';

function Customer() {
  const height = useSelector(selectWith2NavbarHeight);
  const width = useSelector(selectWith2NavbarWidth);

  const [customerData, setCustomerData] = useState<LibraryGuest[]>();
  const [refData, setRefData] = useState<DropdownOption[]>();
  const [accomodationLocationData, setAccomodationLocationData] = useState<SettingsLocation[]>();
  const [holidayTypeData, setHolidayTypeData] = useState<DropdownOption[]>();

  const [title, setTitle] = useState('');
  const [quoteNum, setQuoteNum] = useState(0);

  const [selectedCustomer, setSelectedCustomer] = useState<LibraryGuest>();
  const [refNum, setRefNum] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [rooms, setRooms] = useState(0);

  const [destinations, setDestinations] = useState<string[]>([]);
  const [toStoreDestinations, setToStoreDestinations] = useState<string[]>([]);
  const [additionalBed, setAdditionalBed] = useState(false);
  const [mealPlan, setMealPlan] = useState(mealPlanOptions[0].value);

  const [holidayType, setHolidayType] = useState('');
  const [checkin, setCheckin] = useState(new Date().toISOString().split('T')[0]);
  const [checkout, setCheckout] = useState(new Date().toISOString().split('T')[0]);
  const [invalidDate, setInvalidDate] = useState(false);
  const [dateType, setDateType] = useState(dateTypeOptions[0].value);
  const [notSpecificDays, setNotSpecificDays] = useState(0);

  const { id: quoteId } = useParams<{ id: string }>();
  const history = useHistory();

  useEffect(() => {
    const getInitialData = async () => {
      const qData = (await getDocs(collection(db, 'Approval Quotations'))).docs;
      const rData = (await getDocs(collection(db, 'Library Guests'))).docs;
      const hData = (await getDocs(collection(db, 'Settings Holiday Types'))).docs;
      const lData = (await getDocs(collection(db, 'Settings Locations'))).docs;

      const aqData = qData.map((dc) => dc.data());
      const rfData = rData.map((dc) => dc.data());
      const htData = hData.map((dc) => dc.data());
      const locData = lData.map((dc) => dc.data());

      const aqIds = qData.map((dc) => dc.id);
      const rfIds = rData.map((dc) => dc.id);
      const htIds = hData.map((dc) => dc.id);
      const locIds = lData.map((dc) => dc.id);

      aqIds.forEach((id, i) => {
        aqData[i].id = id;
      });
      rfIds.forEach((id, i) => {
        rfData[i].id = id;
      });
      htIds.forEach((id, i) => {
        htData[i].id = id;
      });
      locIds.forEach((id, i) => {
        locData[i].id = id;
      });

      const refNums = rfData.map((cus) => ({
        value: cus.refNum,
        label: cus.refNum,
      }));
      const holidays = htData.map((hol) => ({
        value: hol.val,
        label: hol.val,
      }));

      const thisQuote = aqData.find((q) => q.id === quoteId) as any;
      localStorage.setItem('Editing Quote', JSON.stringify({ thisQuote }));
      setQuoteNum(aqData.length + 1);
      setRefNum(thisQuote.refNum);
      setTitle(thisQuote.quoteTitle);
      setAdditionalBed(thisQuote.additionalBed);
      setMealPlan(thisQuote.mealPlan);
      setDateType(thisQuote.dateType);
      if (thisQuote.dateType === dateTypeOptions[0].value) {
        setCheckin(thisQuote.saveCheckin);
        setCheckout(thisQuote.saveCheckout);
      } else {
        const storedCheckin = thisQuote.saveCheckin.split('-');
        const storedCheckout = thisQuote.saveCheckout.split('-');
        storedCheckin.pop();
        storedCheckout.pop();
        setCheckin(storedCheckin.join('-'));
        setCheckout(storedCheckout.join('-'));
        setNotSpecificDays(thisQuote.notSpecificDays);
      }
      setHolidayType(thisQuote.holidayType);
      setToStoreDestinations(thisQuote.toStoreDestinations);
      onRefNumChange(rfData as LibraryGuest[], thisQuote.refNum);

      setAccomodationLocationData(locData as SettingsLocation[]);
      setCustomerData(rfData as LibraryGuest[]);
      setRefData(refNums);
      setHolidayTypeData(holidays);

      const storedCustomerData = localStorage.getItem('New Quote Customer');
      if (storedCustomerData) {
        const cusData = JSON.parse(storedCustomerData).data[0];
        setRefNum(cusData[2] || localStorage.getItem('New Guest Ref Num') || refNums[0].value);
        setTitle(cusData[0]);
        setDateType(cusData[16]);
        setAdditionalBed(cusData[14]);
        setMealPlan(cusData[13]);
        setToStoreDestinations(cusData[15]);
        setDestinations(cusData[15]);
        setEmail(cusData[18]);
        setRooms(cusData[19]);

        if (cusData[16] === dateTypeOptions[0].value) {
          setCheckin(cusData[7]);
          setCheckout(cusData[8]);
        } else {
          const storedCheckin = cusData[7].split('-');
          const storedCheckout = cusData[8].split('-');
          storedCheckin.pop();
          storedCheckout.pop();
          setCheckin(storedCheckin.join('-'));
          setCheckout(storedCheckout.join('-'));
          setNotSpecificDays(cusData[17]);
        }
      }
    };

    getInitialData();
  }, []);

  const onRefNumChange = (data: LibraryGuest[], rf: string) => {
    setRefNum(rf);
    const customer = data.find((cus) => cus.refNum === rf);
    setSelectedCustomer(customer);
    if (customer) {
      setFirstName(customer.name.split(' ')[0]);
      setLastName(customer.name.split(' ')[1]);
      setContactNumber(customer.tel);
      setEmail(customer.email);
      setCountry(customer.country.value);
      setCity(customer.city.value);
      setRooms(customer.rooms || 3);
    }
  };

  const onCreateCustomer = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    event.preventDefault();
    setInvalidDate(false);
    const saveCheckin = checkin.split('-').length === 2 ? `${checkin}-15` : checkin;
    const saveCheckout = checkout.split('-').length === 2 ? `${checkout}-15` : checkout;
    const daysDiff = getDaysDifference(saveCheckout, saveCheckin);

    const currentDate = new Date().valueOf();
    if (new Date(saveCheckin).valueOf() > new Date(saveCheckout).valueOf()
      || new Date(saveCheckin).valueOf() < currentDate
      || daysDiff >= 29) {
      setInvalidDate(true);
      return;
    }

    localStorage.setItem(
      'New Quote Customer',
      JSON.stringify({
        data: [[
          title,
          quoteNum,
          refNum,
          firstName,
          lastName,
          contactNumber,
          country,
          saveCheckin,
          saveCheckout,
          selectedCustomer?.adults,
          selectedCustomer?.childrenAges,
          selectedCustomer?.id,
          holidayType,
          mealPlan,
          additionalBed,
          toStoreDestinations,
          dateType,
          dateType === dateTypeOptions[1].value ? notSpecificDays : null,
          email,
          rooms,
        ]],
      }),
    );

    history.replace(`/quote/quotations/edit/${quoteId}/accomodation`);
  };

  return (
    <DivAtom style={{ height: `${height}px` }}>
      <DivAtom style={quoteCreateQuoteStyles.header}>
        <IconAtom
          size="small"
          children={<ChevronLeftRoundedIcon />}
          style={quoteCreateQuoteStyles.backBtn}
          onClick={() => history.replace('/quote/quotations')}
        />
        <H2Atom style={quoteCreateQuoteStyles.title} text="Edit Quotation" />
      </DivAtom>

      {customerData && refData && holidayTypeData && accomodationLocationData ? (
        <CustomerForm
          customerData={customerData}
          refData={refData}
          accomodationLocationData={accomodationLocationData}
          holidayTypeData={holidayTypeData}
          width={width}
          notSpecificDays={notSpecificDays}
          refNum={refNum}
          title={title}
          setTitle={setTitle}
          firstName={firstName}
          lastName={lastName}
          contactNumber={contactNumber}
          email={email}
          country={country}
          city={city}
          holidayType={holidayType}
          destinations={destinations}
          mealPlan={mealPlan}
          dateType={dateType}
          checkin={checkin}
          checkout={checkout}
          additionalBed={additionalBed}
          invalidDate={invalidDate}
          onCreateCustomer={onCreateCustomer}
          onRefNumChange={onRefNumChange}
          setNotSpecificDays={setNotSpecificDays}
          setFirstName={setFirstName}
          setLastName={setLastName}
          setContactNumber={setContactNumber}
          setEmail={setEmail}
          setCountry={setCountry}
          setCity={setCity}
          setHolidayType={setHolidayType}
          setDestinations={setDestinations}
          setToStoreDestinations={setToStoreDestinations}
          setMealPlan={setMealPlan}
          setAdditionalBed={setAdditionalBed}
          setDateType={setDateType}
          setCheckin={setCheckin}
          setCheckout={setCheckout}
        />
      ) : (
        <DivAtom style={fetchingDataIndicatorStyles.container}>
          <CircularProgress size={20} color="primary" />
        </DivAtom>
      )}
    </DivAtom>
  );
}

export default Customer;
