import { useEffect, useState } from 'react';

import { CircularProgress, TextField } from '@material-ui/core';
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
import Comments from '../../../../organisms/quote/quotation/create-quotation/approval/Comments';
import GuestDetails from '../../../../organisms/quote/quotation/create-quotation/approval/GuestDetails';
import Offers from '../../../../organisms/quote/quotation/create-quotation/approval/Offers';
import TourTypeDialog from '../../../../organisms/quote/quotation/create-quotation/approval/TourTypeDialog';
import { selectWith2NavbarHeight, selectWith2NavbarWidth } from '../../../../redux/containerSizeSlice';
import { selectUser } from '../../../../redux/userSlice';
import { approvalStyles, fetchingDataIndicatorStyles, quoteCreateQuoteStyles } from '../../../../styles';
import {
  convertDateToFullMonth,
  getDaysDifference,
  getElementWidth,
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
  const [rooms, setRooms] = useState('');
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

  const [comments, setComments] = useState<any>();
  const [commentsChecked, setCommentsChecked] = useState<boolean[]>([]);
  const [additionalComments, setAdditionalComments] = useState('');

  // Tour Type
  const [driverChoice, setDriverChoice] = useState<LibraryDriver>();
  const [driverData, setDriverData] = useState<LibraryDriver[]>();
  const [tourType, setTourType] = useState(tourTypeOptions[0].value);
  const [openTourTypeDialog, setOpenTourTypeDialog] = useState(false);
  const [showTourTypeValidationErrorMsg, setShowTourTypeValidationErrorMsg] = useState(false);

  const [showRateContainer, setShowRateContainer] = useState(true);
  const [isApprovingQuote, setIsApprovingQuote] = useState(false);
  const [isSavingQuote, setIsSavingQuote] = useState(false);

  const history = useHistory();

  useEffect(() => {
    const getInitialData = async () => {
      const ldData = (await getDocs(collection(db, 'Library Drivers'))).docs;
      const scData = (await getDocs(collection(db, 'Settings Comments'))).docs;
      const dData = ldData.map((dc) => dc.data());
      const cData = scData.map((dc) => dc.data());
      const dIds = ldData.map((dc) => dc.id);
      const cIds = scData.map((dc) => dc.id);
      dIds.forEach((id, i) => {
        dData[i].id = id;
      });
      cIds.forEach((id, i) => {
        cData[i].id = id;
      });

      setComments(cData);
      setCommentsChecked(new Array(cData.length).fill(false));
      setDriverData(dData as LibraryDriver[]);
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
    setRefNum(customerDetails[2]);
    setFirstName(customerDetails[3]);
    setLastName(customerDetails[4]);
    setNationality(customerDetails[6]);
    if (customerDetails[16] === 'Not Specific') {
      setArrival(convertDateToFullMonth(customerDetails[7]));
      setDeparture(convertDateToFullMonth(customerDetails[8]));
      setDaysAndNights(`${customerDetails[17]} - ${Number(customerDetails[17]) - 1}`);
    } else {
      setArrival(customerDetails[7]);
      setDeparture(customerDetails[8]);
      setDaysAndNights(`${daysDifference + 1} - ${daysDifference}`);
    }

    setAdults(customerDetails[9]);
    setChildren(customerDetails[10]);
    setUserId(customerDetails[11]);
    setEmail(customerDetails[18]);
    setRooms(customerDetails[19] || '1');

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
    const { elementWidth, elementHeight } = getElementWidth('report');
    const report = new JSPDF('landscape', 'pt', [elementWidth + 10, elementHeight + 10]);
    return report.html(document.querySelector('#report') as HTMLElement).then(async () => {
      const filename = `${uuid()}-${firstName}.pdf`;
      const pdfURL = await uploadPDF(storage, 'customer-quotation-pdfs', report.output('blob'), filename);
      report.save(filename);
      return pdfURL;
    });
  };

  const approveUserQuotation = async () => {
    const guestDetails = await createQuote(driverChoice!, 'APPROVED', setIsApprovingQuote);

    // Close any existing quote of same ref num
    const eqData = (await getDocs(collection(db, 'Approval Quotations'))).docs;
    const existingQuotations = eqData.map((dc) => dc.data());
    const existingQuotationsIds = eqData.map((dc) => dc.id);
    existingQuotationsIds.forEach((id, i) => {
      existingQuotations[i].id = id;
    });
    const existingQuote = existingQuotations.find((q) => q.refNum === refNum);
    if (existingQuote && existingQuote.status !== 'APPROVED') {
      await setDoc(doc(db, 'Approval Quotations', existingQuote.id), {
        ...existingQuote,
        status: 'CLOSED',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    await createVouchers(guestDetails);
    clearLocalStorage();
    setIsApprovingQuote(false);
    setCreated(true);
    history.replace('/quote/voucher');
  };

  const saveUserQuotation = async () => {
    const guestDetails = await createQuote(null, 'IN PROGRESS', setIsSavingQuote);
    await createVoucher(guestDetails, 'Itinerary Voucher', 'Itinerary');
    clearLocalStorage();
    setIsSavingQuote(false);
    setCreated(true);
    history.replace('/dashboard');
  };

  const createQuote = async (dc: LibraryDriver | null, status: string, updater: any) => {
    const customerDetails = JSON.parse(
      localStorage.getItem('New Quote Customer')!,
    ).data[0];
    const selectedAcc = JSON.parse(
      localStorage.getItem('New Quote Accomodation')!,
    );

    updater(true);
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
      tourType,
      status,
      commentsChecked,
      additionalComments,
      rooms,
      driverChoice: dc,
      saveCheckin: customerDetails[7],
      saveCheckout: customerDetails[8],
      holidayType: customerDetails[12],
      mealPlan: customerDetails[13],
      additionalBed: customerDetails[14],
      toStoreDestinations: customerDetails[15],
      dateType: customerDetails[16],
      notSpecificDays: customerDetails[17],
      accDetails: {
        selectedAccomodations: selectedAcc.selectedAccomodations as UserAccomodation[],
        selectedAccomodationsMealPlans: selectedAcc.selectedAccomodationsMealPlans,
        selectedAccomodationsRoomTypes: selectedAcc.selectedAccomodationsRoomTypes,
        selectedAccomodationsRoomViews: selectedAcc.selectedAccomodationsRoomViews,
        selectedAccomodationsAdditionalBed: selectedAcc.selectedAccomodationsAdditionalBed,
        selectedAccomodationsNights: selectedAcc.selectedAccomodationsNights,
        selectedAccomodationsPax: selectedAcc.selectedAccomodationsPax,
      },
      user: userId,
      creator: user,
      name: `${firstName} ${lastName}`,
    };

    await setDoc(doc(db, 'Approval Quotations', uuid()), {
      ...guestDetails,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return guestDetails;
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
    // await createVoucher(guestDetails, 'Itinerary Voucher', 'Itinerary');
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

    const accomodationDetails = JSON.parse(
      localStorage.getItem('New Quote Accomodation')!,
    ).selectedAccomodations;

    // Store only main accomodations
    const toStoreAccomodations = accomodationDetails.filter((acc: any) => (
      (acc.isMultiple && acc.additionalEntries) || !acc.isMultiple
    ));

    await setDoc(doc(db, 'Vouchers', String(quoteNo), 'Vouchers', `${String(quoteNo)}-${type}-${title}`), {
      vId,
      guestDetails,
      type,
      title,
      accomodationDetails: toStoreAccomodations,
      quoteNo: String(quoteNo),
      quotationTitle: quoteTitle,
      mainVId: `${quoteTitle.slice(0, 5)} V`,
      driverDetails: title === 'Itinerary' ? null : driverChoice,
      completed: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  const createAccomodationVouchers = async (guestDetails: any, type: string) => {
    accomodationData!.forEach(async (acc) => {
      if ((acc.isMultiple && acc.additionalEntries) || !acc.isMultiple) {
        const accVName = acc.name.toUpperCase().split(' ').map((w) => w[0]).join('');
        const vId = `${quoteTitle.slice(0, 5)} HV${accVName}`;

        await setDoc(doc(db, 'Vouchers', String(quoteNo), 'Vouchers', `${String(quoteNo)}-${type}-${acc.name}`), {
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
      }
    });
  };

  const getSaveQuoteOffers = (val: boolean) => (val ? 'Yes' : 'No');

  const OffersContainer = () => (!isSavingQuote && !isApprovingQuote ? (
    <DivAtom
      style={{ borderBottom: '2px solid #41E93E', padding: '1rem' }}
    >
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
      <Comments
        comments={comments}
        setCommentsChecked={setCommentsChecked}
        commentsChecked={commentsChecked}
      />
    </DivAtom>
  ) : (
    <DivAtom style={approvalStyles.offers.container}>
      <ParagraphAtom style={approvalStyles.titleText} text="This offer includes:" />
      <ul>
        <li>Room and Breakfast in the hotel: {getSaveQuoteOffers(roomAndBreakfast)}</li>
        <li>Reception at Airport: {getSaveQuoteOffers(receptionAtAirport)}</li>
        <li>All Government Taxes: {getSaveQuoteOffers(allGovernmentTaxes)}</li>
        { /* eslint-disable-next-line max-len */}
        <li>Guide and the Car. Transportation from Reception to Fairwell, (Throught the Trip): {getSaveQuoteOffers(guideAndCar)}</li>
      </ul>

      {!commentsChecked.every((a) => !a) && (
        <>
          <ul>
            {comments.map((c: { val: string }, i: number) => commentsChecked[i] && (
              <li key={i}>{c.val}</li>
            ))}
          </ul>
        </>
      )}

      <ParagraphAtom style={approvalStyles.titleText} text="Additional Comments:" />
      <ParagraphAtom text={additionalComments} />
    </DivAtom>
  ));

  return (
    <DivAtom style={{ height: `${height}px` }}>
      {(accomodationData && rateData && driverData && comments) ? (
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
                rooms={rooms}
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
                          'Pax',
                          'Room Type',
                          'Meal Plan',
                          'Room Rate',
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
              {(!isSavingQuote && !isApprovingQuote) && (
                <DivAtom style={{ paddingTop: '1rem' }}>
                  <TextField
                    multiline
                    fullWidth
                    variant="outlined"
                    maxRows={20}
                    minRows={5}
                    value={additionalComments}
                    onChange={(e) => setAdditionalComments(e.target.value)}
                    label="Additional Comments"
                    color="primary"
                    focused
                  />
                </DivAtom>
              )}
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
              text="Save"
              endIcon={isSavingQuote && <CircularProgress size={20} color="inherit" />}
              disabled={isSavingQuote}
              onClick={saveUserQuotation}
              style={{
                ...quoteCreateQuoteStyles.addBtn,
                width: widthHeightDynamicStyle(width, 768, '100%', '18%'),
                margin: widthHeightDynamicStyle(width, 768, '100%', '18%') ? '0 1rem 1rem 0' : '0 0 1rem 2rem',
              }}
            />
            <ButtonAtom
              size="large"
              text="Approve"
              endIcon={isApprovingQuote && <CircularProgress size={20} color="inherit" />}
              disabled={isApprovingQuote || tourType === '' || !driverChoice}
              onClick={approveUserQuotation}
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
