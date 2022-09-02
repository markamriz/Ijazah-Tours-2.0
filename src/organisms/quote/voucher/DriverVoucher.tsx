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
import { db } from '../../../firebase';
import FormControlInput from '../../../molecules/FormControlInput';
import { selectWithNavbarWidth } from '../../../redux/containerSizeSlice';
import { voucherStyles } from '../../../styles';
import { getElementWidth, uploadPDF, widthHeightDynamicStyle } from '../../../utils/helpers';
import Banner from '../quotation/create-quotation/approval/Banner';
import VoucherGuestTable from './specific-voucher/VoucherGuestTable';
import VoucherSummary from './specific-voucher/VoucherSummary';

const storage = getStorage();

interface DriverVoucherProps {
  voucherData: any;
  setIsVoucherApproved: any;
}

function DriverVoucher({ voucherData, setIsVoucherApproved }: DriverVoucherProps) {
  const width = useSelector(selectWithNavbarWidth);

  const { id } = useParams<{ id: string }>();
  const [quoteNo] = useState(id.split('+')[1]);
  const [vData, setVData] = useState(voucherData[quoteNo].find((voucher: { id: string }) => (
    voucher.id === id.split('+')[0]
  )));

  const [director, setDirector] = useState(vData.director || '');
  const [remarks, setRemarks] = useState(vData.remarks || '');
  const [driverRate, setDriverRate] = useState(vData.driverRate || vData.driverDetails?.rate || '');

  const [isSavingVoucher, setIsSavingVoucher] = useState(false);

  const history = useHistory();

  const generatePDF = async () => {
    const { elementWidth, elementHeight } = getElementWidth('report');
    const report = new JSPDF('landscape', 'pt', [elementWidth + 10, elementHeight + 10]);
    return report.html(document.querySelector('#report') as HTMLElement, {
      image: {
        type: 'png',
        quality: 100,
      },
      html2canvas: {
        scale: 1,
        allowTaint: true,
        letterRendering: true,
        svgRendering: true,
      },
    }).then(async () => {
      const filename = `${uuid()}-${vData.guestDetails.name}.pdf`;
      const pdfURL = await uploadPDF(storage, 'voucher-driver-pdfs', report.output('blob'), filename);
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
    vDataCopy.director = director;
    vDataCopy.remarks = remarks;
    vDataCopy.driverRate = driverRate;
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
        <H2Atom style={voucherStyles.title} text="Driver Voucher" />
      </DivAtom>

      <div id="report">
        <DivAtom style={{ padding: '2rem' }}>
          <Banner />
          <VoucherSummary vData={vData} type="driver" />
          <VoucherGuestTable
            accColumns={['NIGHTS', 'CITY', 'ACCOMODATION']}
            guestColumns={['ADULTS', 'CHILDREN', 'AGE']}
            data={vData}
          />
          <DivAtom
            style={{
              ...voucherStyles.voucherTemplate.summaryDetails.mainContainer,
              justifyContent: 'flex-end',
            }}
          >
            <DivAtom>
              {!isSavingVoucher && (
                <p style={voucherStyles.voucherTemplate.summaryDetails.detailContainer}>
                  <SpanAtom
                    text="Transport Total"
                    style={voucherStyles.voucherTemplate.summaryDetails.label}
                  />
                  <SpanAtom
                    text={`$${vData.guestDetails.costings.transportTotal}`}
                    style={voucherStyles.voucherTemplate.summaryDetails.detail}
                  />
                </p>
              )}
              {!isSavingVoucher ? (
                <FormControlInput
                  width="100%"
                  label="Rate"
                  fullWidth={true}
                  multiline={false}
                  rows={1}
                  value={driverRate}
                  setValue={setDriverRate}
                  placeholder=""
                />
              ) : (
                <p style={voucherStyles.voucherTemplate.summaryDetails.detailContainer}>
                  <SpanAtom
                    text="Rate"
                    style={voucherStyles.voucherTemplate.summaryDetails.label}
                  />
                  <SpanAtom
                    text={driverRate}
                    style={voucherStyles.voucherTemplate.summaryDetails.detail}
                  />
                </p>
              )}
            </DivAtom>
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
                maxRows={10}
                minRows={5}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                label="Remarks"
                color="primary"
                focused
              />
            ) : (
              <DivAtom>
                <SpanAtom
                  text="Remarks"
                  style={voucherStyles.voucherTemplate.summaryDetails.label}
                />
                <ParagraphAtom text={remarks} />
              </DivAtom>
            )}
          </DivAtom>
          <DivAtom
            style={{
              ...voucherStyles.voucherTemplate.summaryDetails.mainContainer,
              justifyContent: !isSavingVoucher ? 'flex-end' : 'flex-start',
              paddingRight: 0,
              borderBottom: 0,
            }}
          >
            {!isSavingVoucher ? (
              <FormControlInput
                width={widthHeightDynamicStyle(width, 1300, '50%', '30%') as string}
                label="Director"
                fullWidth={false}
                multiline={false}
                rows={1}
                value={director}
                setValue={setDirector}
                placeholder=""
              />
            ) : (
              <DivAtom>
                <SpanAtom
                  text="Director"
                  style={voucherStyles.voucherTemplate.summaryDetails.label}
                />
                <ParagraphAtom text={director} />
              </DivAtom>
            )}
          </DivAtom>
        </DivAtom>
      </div>

      <DivAtom style={{ padding: '2rem' }}>
        <ButtonAtom
          size="large"
          text="Confirm"
          endIcon={isSavingVoucher && <CircularProgress size={20} color="inherit" />}
          disabled={isSavingVoucher || director === '' || remarks === ''}
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

export default DriverVoucher;
