import { useEffect, useState } from 'react';

import { CircularProgress } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import JSPDF from 'jspdf';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

import ButtonAtom from '../../../../atoms/ButtonAtom';
import DivAtom from '../../../../atoms/DivAtom';
import IconAtom from '../../../../atoms/IconAtom';
import ParagraphAtom from '../../../../atoms/ParagraphAtom';
import { db } from '../../../../firebase';
import ApprovalAccomodationTable from '../../../../organisms/quote/quotation/create-quotation/approval/ApprovalAccomodationTable';
import ApprovalOverallCost from '../../../../organisms/quote/quotation/create-quotation/approval/ApprovalOverallCost';
import ApprovalRateComparisonTable from '../../../../organisms/quote/quotation/create-quotation/approval/ApprovalRateComparisonTable';
import Banner from '../../../../organisms/quote/quotation/create-quotation/approval/Banner';
import GuestDetails from '../../../../organisms/quote/quotation/create-quotation/approval/GuestDetails';
import Offers from '../../../../organisms/quote/quotation/create-quotation/approval/Offers';
import TourTypeDialog from '../../../../organisms/quote/quotation/create-quotation/approval/TourTypeDialog';
import { selectWith2NavbarHeight, selectWith2NavbarWidth } from '../../../../redux/containerSizeSlice';
import { selectUser } from '../../../../redux/userSlice';
import { approvalStyles, fetchingDataIndicatorStyles, quoteCreateQuoteStyles } from '../../../../styles';
import {
  getDaysDifference,
  tourTypeOptions,
  uploadPDF,
  widthHeightDynamicStyle,
} from '../../../../utils/helpers';
import { LibraryDriver, QuotationCostingRate, UserAccomodation } from '../../../../utils/types';

const storage = getStorage();

interface ApprovalProps {
  setCreated: any;
}

function Approval({ setCreated }: ApprovalProps) {
  const user = useSelector(selectUser);
  const height = useSelector(selectWith2NavbarHeight);
  const width = useSelector(selectWith2NavbarWidth);

  const [rateData, setRateData] = useState<QuotationCostingRate[]>([]);
  const [accomodationData, setAccomodationData] = useState<UserAccomodation[]>();

  // Customer details
  const [refNum, setRefNum] = useState('');
  const [userId, setUserId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [lastName, setLastName] = useState('');
  const [nationality, setNationality] = useState('');
  const [arrival, setArrival] = useState('');
  const [departure, setDeparture] = useState('');
  const [daysAndNights, setDaysAndNights] = useState('');
  const [quoteTitle, setQuoteTitle] = useState('');
  const [quoteNo, setQuoteNo] = useState('');
  const [adults, setAdults] = useState('');
  const [children, setChildren] = useState<string[]>(['']);

  // Overall cost
  const [sellingPrice, setSellingPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [netPrice, setNetPrice] = useState('');

  // offer extras
  const [roomAndBreakfast, setRoomAndBreakfast] = useState(false);
  const [receptionAtAirport, setReceptionAtAirport] = useState(false);
  const [allGovernmentTaxes, setAllGovernmentTaxes] = useState(false);
  const [guideAndCar, setGuideAndCar] = useState(false);

  // Tour Type
  const [driverChoice, setDriverChoice] = useState<LibraryDriver>();
  const [driverData, setDriverData] = useState<LibraryDriver[]>();
  const [tourType, setTourType] = useState(tourTypeOptions[0].value);
  const [openTourTypeDialog, setOpenTourTypeDialog] = useState(false);
  const [showTourTypeValidationErrorMsg, setShowTourTypeValidationErrorMsg] = useState(false);

  const [showRateContainer, setShowRateContainer] = useState(true);
  const [isSavingQuote, setIsSavingQuote] = useState(false);

  const history = useHistory();

  useEffect(() => {
    const getInitialData = async () => {
      const dData = (await getDocs(collection(db, 'Library Drivers'))).docs;
      const data = dData.map((dc) => dc.data());
      const ids = dData.map((dc) => dc.id);
      ids.forEach((id, i) => {
        data[i].id = id;
      });

      setDriverData(data as LibraryDriver[]);
    };

    getInitialData();
  }, []);

  useEffect(() => {
    const customerDetails = JSON.parse(
      localStorage.getItem('New Quote Customer')!,
    ).data[0];
    const accomodationDetails: UserAccomodation[] = JSON.parse(
      localStorage.getItem('New Quote Accomodation')!,
    ).selectedAccomodations;

    setAccomodationData(accomodationDetails);

    const daysDifference = getDaysDifference(customerDetails[8], customerDetails[7]);
    setQuoteTitle(customerDetails[0]);
    setQuoteNo(customerDetails[1]);
    setDaysAndNights(`${daysDifference + 1} - ${daysDifference}`);
    setRefNum(customerDetails[2]);
    setFirstName(customerDetails[3]);
    setLastName(customerDetails[4]);
    setNationality(customerDetails[6]);
    setArrival(customerDetails[7]);
    setDeparture(customerDetails[8]);
    setAdults(customerDetails[9]);
    setChildren(customerDetails[10]);
    setUserId(customerDetails[11]);
    setEmail(customerDetails[18]);

    const costDetails = JSON.parse(localStorage.getItem('New Quote Costing')!);
    setSellingPrice(costDetails.sellingPrice);
    setDiscount(costDetails.discount);
    setNetPrice(costDetails.netPrice);
    setRateData(costDetails.comparisonData || []);
  }, []);

  useEffect(() => {
    const storedCosting = JSON.parse(localStorage.getItem('New Quote Costing')!);
    if (storedCosting) {
      setSellingPrice(`$${storedCosting.sellingPrice}`);
      setDiscount(`$${storedCosting.discount}`);
      setNetPrice(`$${storedCosting.netPrice}`);
    }
  }, []);

  const deleteRate = (acc: QuotationCostingRate) => {
    const removeIndex = rateData.findIndex((ac) => ac.id === acc.id);
    const tempRates = [...rateData];
    tempRates.splice(removeIndex, 1);
    setRateData(tempRates);
  };

  const removeRateContainer = () => {
    setShowRateContainer(false);
  };

  const generatePDF = async () => {
    const report = new JSPDF('portrait', 'pt', 'a2');
    return report.html(document.querySelector('#report') as HTMLElement).then(async () => {
      const filename = `${uuid()}-${firstName}.pdf`;
      const pdfURL = await uploadPDF(storage, 'customer-quotation-pdfs', report.output('blob'), filename);
      report.save(filename);
      return pdfURL;
    });
  };

  const saveUserQuotation = async () => {
    setIsSavingQuote(true);
    setCreated(false);
    const pdfURL = await generatePDF();

    const accomodations = JSON.parse(localStorage.getItem('New Quote Accomodation')!).selectedAccomodations;
    const costings = JSON.parse(localStorage.getItem('New Quote Costing')!);

    const guestDetails = {
      refNum,
      nationality,
      arrival,
      departure,
      adults,
      children,
      netPrice,
      sellingPrice,
      discount,
      quoteTitle,
      quoteNo,
      daysAndNights,
      roomAndBreakfast,
      receptionAtAirport,
      allGovernmentTaxes,
      guideAndCar,
      pdfURL,
      accomodations,
      costings,
      email,
      user: userId,
      creator: user,
      name: `${firstName} ${lastName}`,
      status: 'IN PROGRESS',
    };

    await setDoc(doc(db, 'Approval Quotations', uuid()), {
      ...guestDetails,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await createVouchers(guestDetails);
    clearLocalStorage();
    setIsSavingQuote(false);
    setCreated(true);
    history.replace('/quote/voucher');
  };

  const onTourTypeConfirm = () => {
    setShowTourTypeValidationErrorMsg(false);

    if (tourType === '' || !driverChoice) {
      setShowTourTypeValidationErrorMsg(true);
    } else {
      setOpenTourTypeDialog(false);
    }
  };

  const clearLocalStorage = () => {
    localStorage.removeItem('New Quote Accomodation');
    localStorage.removeItem('New Quote Customer');
    localStorage.removeItem('New Quote Costing');
  };

  const createVouchers = async (guestDetails: any) => {
    await createVoucher(guestDetails, 'Driver Voucher', 'Driver');
    await createVoucher(guestDetails, 'Itinerary Voucher', 'Itinerary');
    await createVoucher(guestDetails, 'Tour Confirmation Voucher', 'Proforma Invoice');
    await createVoucher(guestDetails, 'Cash Receipt', 'Cash Receipt');

    if (tourType === tourTypeOptions[0].value) {
      await createAccomodationVouchers(guestDetails, 'Supplier Voucher');
    }
  };

  const createVoucher = async (guestDetails: any, type: string, title: string) => {
    let vId = '';
    switch (title) {
    case 'Driver':
      vId = `${quoteTitle.slice(0, 5)} DV`;
      break;
    case 'Itinerary':
      vId = `${quoteTitle.slice(0, 5)} IV`;
      break;
    case 'Proforma Invoice':
      vId = `${quoteTitle.slice(0, 5)} PIV`;
      break;
    case 'Cash Receipt':
    default:
      vId = `${quoteTitle.slice(0, 5)} CRV`;
      break;
    }

    await setDoc(doc(db, 'Vouchers', String(quoteNo), 'Vouchers', uuid()), {
      vId,
      guestDetails,
      type,
      title,
      quoteNo: String(quoteNo),
      quotationTitle: quoteTitle,
      mainVId: `${quoteTitle.slice(0, 5)} V`,
      driverDetails: driverChoice,
      accomodationDetails: JSON.parse(
        localStorage.getItem('New Quote Accomodation')!,
      ).selectedAccomodations,
      completed: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  const createAccomodationVouchers = async (guestDetails: any, type: string) => {
    accomodationData!.forEach(async (acc) => {
      const accVName = acc.name.toUpperCase().split(' ').map((w) => w[0]).join('');
      const vId = `${quoteTitle.slice(0, 5)} HV${accVName}`;

      await setDoc(doc(db, 'Vouchers', String(quoteNo), 'Vouchers', uuid()), {
        vId,
        guestDetails,
        type,
        title: acc.name,
        mainVId: `${quoteTitle.slice(0, 5)} V`,
        quoteNo: String(quoteNo),
        quotationTitle: quoteTitle,
        driverDetails: driverChoice,
        accomodationDetails: acc,
        completed: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    });
  };

  const getSaveQuoteOffers = (val: boolean) => (val ? 'Yes' : 'No');

  const OffersContainer = () => (!isSavingQuote ? (
    <Offers
      roomAndBreakfast={roomAndBreakfast}
      receptionAtAirport={receptionAtAirport}
      allGovernmentTaxes={allGovernmentTaxes}
      guideAndCar={guideAndCar}
      setRoomAndBreakfast={setRoomAndBreakfast}
      setReceptionAtAirport={setReceptionAtAirport}
      setAllGovernmentTaxes={setAllGovernmentTaxes}
      setGuideAndCar={setGuideAndCar}
    />
  ) : (
    <DivAtom style={approvalStyles.offers.container}>
      <ParagraphAtom style={approvalStyles.titleText} text="This offer includes:" />
      <ul>
        <li>Room and Breakfast in the hotel: {getSaveQuoteOffers(roomAndBreakfast)}</li>
        <li>Reception at Airport: {getSaveQuoteOffers(receptionAtAirport)}</li>
        <li>All Government Taxes: {getSaveQuoteOffers(allGovernmentTaxes)}</li>
        { /* eslint-disable-next-line max-len */ }
        <li>Guide and the Car. Transportation from Reception to Fairwell, (Throught the Trip): {getSaveQuoteOffers(guideAndCar)}</li>
      </ul>
    </DivAtom>
  ));

  return (
    <DivAtom style={{ height: `${height}px` }}>
      {(accomodationData && rateData && driverData) ? (
        <>
          <div id="report">
            <DivAtom style={{ padding: '2rem' }}>
              <Banner />
              <GuestDetails
                name={`${firstName} ${lastName}`}
                nationality={nationality}
                adults={adults}
                quoteNo={quoteNo}
                arrival={arrival}
                departure={departure}
                daysAndNights={daysAndNights}
                children={children}
              />
              {tourType === tourTypeOptions[0].value && (
                <>
                  <DivAtom style={quoteCreateQuoteStyles.tableContainer}>
                    {showRateContainer && rateData.length > 0 && (
                      <>
                        <DivAtom style={approvalStyles.rates.titleContainer}>
                          <IconAtom
                            onClick={removeRateContainer}
                            style={{ padding: '8px' }}
                            size="small"
                            children={<CloseIcon style={{ color: 'black' }} />}
                          />
                          <ParagraphAtom style={approvalStyles.titleText} text="Rate Comparison" />
                        </DivAtom>
                        <ApprovalRateComparisonTable
                          columns={[
                            'Accomodation',
                            'Booking Engine',
                            'Rate',
                            '',
                          ]}
                          deleteRate={deleteRate}
                          data={rateData}
                        />
                      </>
                    )}
                  </DivAtom>
                  {accomodationData.length > 0 && (
                    <DivAtom style={{ marginTop: '1rem', ...quoteCreateQuoteStyles.tableContainer }}>
                      <ApprovalAccomodationTable
                        columns={[
                          'Nights',
                          'Accomodation',
                          'Room Type',
                          'Room View',
                        ]}
                        data={accomodationData}
                      />
                    </DivAtom>
                  )}
                </>
              )}
              <ApprovalOverallCost
                sellingPrice={sellingPrice}
                discount={discount}
                netPrice={netPrice}
              />
              <OffersContainer />
            </DivAtom>
          </div>

          <DivAtom style={{ padding: '2rem' }}>
            <ButtonAtom
              size="large"
              text="Select Tour Type"
              onClick={() => setOpenTourTypeDialog(true)}
              style={{
                ...quoteCreateQuoteStyles.addBtn,
                width: widthHeightDynamicStyle(width, 768, '100%', '18%'),
                margin: widthHeightDynamicStyle(width, 768, '100%', '18%') ? '0 1rem 1rem 0' : '0 0 1rem 2rem',
              }}
            />

            <ButtonAtom
              size="large"
              text="Approve"
              endIcon={isSavingQuote && <CircularProgress size={20} color="inherit" />}
              disabled={isSavingQuote || tourType === '' || !driverChoice}
              onClick={saveUserQuotation}
              style={{
                ...quoteCreateQuoteStyles.addBtn,
                width: widthHeightDynamicStyle(width, 768, '100%', '18%'),
                margin: widthHeightDynamicStyle(width, 768, '100%', '18%') ? '0 1rem 1rem 0' : '0 0 1rem 2rem',
              }}
            />
          </DivAtom>

          <TourTypeDialog
            title="Select Tour Type"
            driverData={driverData}
            openDialog={openTourTypeDialog}
            setOpenDialog={setOpenTourTypeDialog}
            tourType={tourType}
            setTourType={setTourType}
            driverChoice={driverChoice}
            setDriverChoice={setDriverChoice}
            onConfirm={onTourTypeConfirm}
            validationErrorMsg={showTourTypeValidationErrorMsg}
          />
        </>
      ) : (
        <DivAtom style={fetchingDataIndicatorStyles.container}>
          <CircularProgress size={20} color="primary" />
        </DivAtom>
      )}
    </DivAtom>
  );
}

export default Approval;
