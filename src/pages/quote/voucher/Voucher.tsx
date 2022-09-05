import { useEffect, useState } from 'react';

import { CircularProgress } from '@material-ui/core';
import {
  collection,
  collectionGroup,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { Route } from 'react-router-dom';

import ButtonAtom from '../../../atoms/ButtonAtom';
import DivAtom from '../../../atoms/DivAtom';
import { db } from '../../../firebase';
import CashReceipt from '../../../organisms/quote/voucher/CashReceipt';
import DriverVoucher from '../../../organisms/quote/voucher/DriverVoucher';
import ItineraryVoucher from '../../../organisms/quote/voucher/ItineraryVoucher';
import SupplierVoucher from '../../../organisms/quote/voucher/SupplierVoucher';
import TourConfirmationVoucher from '../../../organisms/quote/voucher/TourConfirmationVoucher';
import VoucherTable from '../../../organisms/quote/voucher/VoucherTable';
import { selectWithNavbarHeight, selectWithNavbarWidth } from '../../../redux/containerSizeSlice';
import { selectUser } from '../../../redux/userSlice';
import { fetchingDataIndicatorStyles, voucherStyles } from '../../../styles';
import { widthHeightDynamicStyle } from '../../../utils/helpers';

function Voucher() {
  const user = useSelector(selectUser);
  const width = useSelector(selectWithNavbarWidth);
  const height = useSelector(selectWithNavbarHeight);
  const [voucherData, setVoucherData] = useState<any>();
  const [isUpdating, setIsUpdating] = useState(false);

  const [isVoucherApproved, setIsVoucherApproved] = useState(false);

  useEffect(() => {
    const getInitialData = async () => {
      const vData = (await getDocs(collectionGroup(db, 'Vouchers'))).docs;
      const vouchData = vData.map((dc) => dc.data());
      const vouchIds = vData.map((dc) => dc.id);
      vouchIds.forEach((id, i) => {
        vouchData[i].id = id;
      });

      const qData = (await getDocs(collection(db, 'Approval Quotations'))).docs;
      const quoteData = qData.map((dc) => dc.data());

      // Show only vouchers of approved quotes
      const aprovedQuoteVouchers: any[] = [];
      vouchData.forEach((v) => {
        const quote = quoteData.find((q) => String(q.quoteNo) === String(v.quoteNo));
        if (quote?.status === 'APPROVED' || quote?.status === 'COMPLETE'
          || (quote?.status === 'IN PROGRESS' && v.title === 'Itinerary')) {
          aprovedQuoteVouchers.push(v);
        }
      });

      const groupedVouchData = _.groupBy(
        aprovedQuoteVouchers,
        (voucher: { quoteNo: string }) => voucher.quoteNo,
      );

      setVoucherData(groupedVouchData);
    };

    getInitialData();
  }, [isVoucherApproved]);

  const onUpdateVoucherStatus = async () => {
    setIsUpdating(true);
    await updateVoucherQuotationStatus();
    setIsUpdating(false);
  };

  const updateVoucherQuotationStatus = async () => {
    Object.keys(voucherData).forEach(async (quoteNo) => {
      const quotationQuery = query(collection(db, 'Approval Quotations'), where('quoteNo', '==', Number(quoteNo)));
      const quotationSnapshot = await getDocs(quotationQuery);
      if (voucherData[quoteNo].every((voucher: { completed: boolean }) => (
        voucher.completed === true))
      ) {
        await setDoc(doc(db, 'Dashboard Tasks', String(`${quoteNo}-approve-quote`)), {
          status: 'Approval of Quote',
          stage: 'A',
          title: voucherData[quoteNo][0].quotationTitle,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          completed: false,
          creator: user,
          refNum: voucherData[quoteNo][0].guestDetails.refNum,
        });

        const startDate = new Date();
        const endDate = new Date();
        const calendarEvent = {
          summary: 'Approval of Quote',
          description: `Reminder - Approval of Quote ${voucherData[quoteNo][0].quotationTitle}`,
          start: {
            dateTime: startDate.toISOString(),
          },
          end: {
            dateTime: new Date(endDate.setDate(startDate.getDate() + 10)).toISOString(),
          },
        };

        const request = (window as any).gapi.client.calendar.events.insert({
          calendarId: 'primary',
          resource: calendarEvent,
        });

        request.execute(() => { });

        quotationSnapshot.forEach(async (snap) => {
          await setDoc(doc(db, 'Approval Quotations', snap.id), {
            ...snap.data(),
            status: 'COMPLETE',
            updatedAt: serverTimestamp(),
          });
        });
      } else {
        quotationSnapshot.forEach(async (snap) => {
          await setDoc(doc(db, 'Approval Quotations', snap.id), {
            ...snap.data(),
            updatedAt: serverTimestamp(),
          });
        });
      }

      await voucherData[quoteNo].forEach(async (voucher: any) => {
        const { id, ...v } = voucher;
        await setDoc(doc(db, 'Vouchers', quoteNo, 'Vouchers', id), {
          ...v,
          updatedAt: serverTimestamp(),
        });
      });
    });
  };

  return (
    <DivAtom style={voucherStyles.container}>
      <DivAtom
        style={{
          ...voucherStyles.innerContainer,
          height: `${height}px`,
        }}
      >
        {voucherData ? (
          <>
            <Route path="/quote/voucher/supplier/:id">
              <SupplierVoucher
                setIsVoucherApproved={setIsVoucherApproved}
                voucherData={voucherData}
              />
            </Route>
            <Route path="/quote/voucher/driver/:id">
              <DriverVoucher
                setIsVoucherApproved={setIsVoucherApproved}
                voucherData={voucherData}
              />
            </Route>
            <Route path="/quote/voucher/itinerary/:id">
              <ItineraryVoucher
                setIsVoucherApproved={setIsVoucherApproved}
                voucherData={voucherData}
              />
            </Route>
            <Route path="/quote/voucher/tour-confirmation/:id">
              <TourConfirmationVoucher
                setIsVoucherApproved={setIsVoucherApproved}
                voucherData={voucherData}
              />
            </Route>
            <Route path="/quote/voucher/receipt/:id">
              <CashReceipt setIsVoucherApproved={setIsVoucherApproved} voucherData={voucherData} />
            </Route>
            <Route exact path="/quote/voucher">
              <DivAtom>
                <VoucherTable
                  columns={['Voucher ID', 'Quotation Title', 'Status', '']}
                  voucherData={voucherData}
                  setVoucherData={setVoucherData}
                />
              </DivAtom>
              <ButtonAtom
                endIcon={isUpdating && <CircularProgress size={20} color="inherit" />}
                size="large"
                disabled={isUpdating}
                text="Update"
                onClick={onUpdateVoucherStatus}
                style={{
                  ...voucherStyles.addBtn,
                  width: widthHeightDynamicStyle(width, 768, '100%', '18%'),
                  marginTop: '1rem',
                }}
              />
            </Route>
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

export default Voucher;
