import { useState } from 'react';

import { CircularProgress, TextField } from '@material-ui/core';
import ChevronLeftRoundedIcon from '@material-ui/icons/ChevronLeftRounded';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import JSPDF from 'jspdf';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

import ButtonAtom from '../../../atoms/ButtonAtom';
import DivAtom from '../../../atoms/DivAtom';
import H2Atom from '../../../atoms/H2Atom';
import IconAtom from '../../../atoms/IconAtom';
import ParagraphAtom from '../../../atoms/ParagraphAtom';
import SpanAtom from '../../../atoms/SpanAtom';
import { TOUR_CONFIRM_STARTING_PROFORMA } from '../../../data';
import { db } from '../../../firebase';
import FormControlInput from '../../../molecules/FormControlInput';
import { selectWithNavbarWidth } from '../../../redux/containerSizeSlice';
import { voucherStyles } from '../../../styles';
import { getElementWidth, uploadPDF, widthHeightDynamicStyle } from '../../../utils/helpers';
import Banner from '../quotation/create-quotation/approval/Banner';
import VoucherGuestTable from './specific-voucher/VoucherGuestTable';
import VoucherSummary from './specific-voucher/VoucherSummary';

const storage = getStorage();

interface TourConfirmationVoucherProps {
  voucherData: any;
  setIsVoucherApproved: any;
}

function TourConfirmationVoucher({
  voucherData,
  setIsVoucherApproved,
}: TourConfirmationVoucherProps) {
  const width = useSelector(selectWithNavbarWidth);

  const { id } = useParams<{ id: string }>();
  const [quoteNo] = useState(id.split('+')[1]);
  const [vData, setVData] = useState(voucherData[quoteNo].find((voucher: { id: string }) => (
    voucher.id === id.split('+')[0]
  )));

  const [advance, setAdvance] = useState(vData.paymentAdvance || '');
  const [balance, setBalance] = useState(vData.paymentBalance || '');
  const [proforma, setProforma] = useState(vData.proforma || TOUR_CONFIRM_STARTING_PROFORMA);

  const [isSavingVoucher, setIsSavingVoucher] = useState(false);

  const history = useHistory();

  const generatePDF = async () => {
    const { elementWidth, elementHeight } = getElementWidth('report');
    const report = new JSPDF('landscape', 'pt', [elementWidth + 10, elementHeight + 10]);
    return report.html(document.querySelector('#report') as HTMLElement, {
      autoPaging: 'text',
      margin: [20, 0, 20, 0],
      html2canvas: {
        scale: 1,
        allowTaint: true,
        letterRendering: true,
        svgRendering: true,
      },
    }).then(async () => {
      const filename = `${uuid()}-${vData.guestDetails.name}.pdf`;
      const pdfURL = await uploadPDF(storage, 'voucher-tour-confirmation-pdfs', report.output('blob'), filename);
      report.save(filename);
      return pdfURL;
    });
  };

  const saveVoucher = async () => {
    setIsSavingVoucher(true);
    setIsVoucherApproved(false);
    const pdfURL = await generatePDF();
    const vDataCopy = { ...vData };
    vDataCopy.pdfURL = pdfURL;
    vDataCopy.proforma = proforma;
    vDataCopy.paymentAdvance = advance;
    vDataCopy.paymentBalance = balance;
    await updateDB(vDataCopy);
    setVData(vDataCopy);
    setIsSavingVoucher(false);
    setIsVoucherApproved(true);
    history.replace('/quote/voucher');
  };

  const updateDB = async (vDataCopy: any) => {
    const { id: updatedVDataId, ...updatedVData } = vDataCopy;
    await setDoc(doc(db, 'Vouchers', quoteNo, 'Vouchers', updatedVDataId), {
      ...updatedVData,
      updatedAt: serverTimestamp(),
    });
  };

  return (
    <>
      <DivAtom style={voucherStyles.header}>
        <IconAtom
          size="small"
          children={<ChevronLeftRoundedIcon />}
          style={voucherStyles.backBtn}
          onClick={() => history.replace('/quote/voucher')}
        />
        <H2Atom style={voucherStyles.title} text="Tour Confirmation" />
      </DivAtom>

      <div id="report">
        <DivAtom style={{ padding: '2rem' }}>
          <Banner />
          <VoucherSummary vData={vData} type="tour-confirmation" />
          <VoucherGuestTable
            accColumns={['NIGHTS', 'CITY', 'ACCOMODATION']}
            guestColumns={['ADULTS', 'CHILDREN', 'AGE']}
            data={vData}
          />
          <DivAtom
            style={{
              ...voucherStyles.voucherTemplate.summaryDetails.mainContainer,
              justifyContent: 'flex-start',
              flexDirection: 'column',
            }}
          >
            <p style={voucherStyles.voucherTemplate.summaryDetails.detailContainer}>
              <SpanAtom
                text="PAYMENT SCHEDULE"
                style={voucherStyles.voucherTemplate.summaryDetails.label}
              />
            </p>
            <FormControlInput
              width={widthHeightDynamicStyle(width, 1300, '50%', '30%') as string}
              label="Advance"
              fullWidth={false}
              multiline={false}
              rows={1}
              value={advance}
              setValue={setAdvance}
              placeholder=""
            />
            <FormControlInput
              width={widthHeightDynamicStyle(width, 1300, '50%', '30%') as string}
              label="Balance"
              fullWidth={false}
              multiline={false}
              rows={1}
              value={balance}
              setValue={setBalance}
              placeholder=""
            />
            <p
              style={{
                ...voucherStyles.voucherTemplate.summaryDetails.detailContainer,
                width: '30%',
                marginTop: '1rem',
              }}
            >
              <SpanAtom
                text="Net Price"
                style={voucherStyles.voucherTemplate.summaryDetails.label}
              />
              <SpanAtom
                text={vData.guestDetails.netPrice}
                style={{ ...voucherStyles.voucherTemplate.summaryDetails.detail, letterSpacing: '2px' }}
              />
            </p>
          </DivAtom>
          <DivAtom
            style={{
              ...voucherStyles.voucherTemplate.summaryDetails.mainContainer,
              borderBottom: 0,
            }}
          >
            {!isSavingVoucher ? (
              <TextField
                multiline
                fullWidth
                variant="outlined"
                maxRows={20}
                minRows={5}
                value={proforma}
                onChange={(e) => setProforma(e.target.value)}
                label="Proforma"
                color="primary"
                focused
              />
            ) : (
              <ParagraphAtom text={proforma} />
            )}
          </DivAtom>
        </DivAtom>
      </div>

      <DivAtom style={{ padding: '2rem' }}>
        <ButtonAtom
          size="large"
          text="Confirm"
          endIcon={isSavingVoucher && <CircularProgress size={20} color="inherit" />}
          disabled={isSavingVoucher || advance === '' || balance === '' || proforma === ''}
          onClick={saveVoucher}
          style={{
            ...voucherStyles.addBtn,
            width: widthHeightDynamicStyle(width, 768, '100%', '15%'),
            margin: widthHeightDynamicStyle(width, 768, '100%', '18%') ? '0 1rem 1rem 0' : '0 0 1rem 2rem',
          }}
        />
      </DivAtom>
    </>
  );
}

export default TourConfirmationVoucher;
