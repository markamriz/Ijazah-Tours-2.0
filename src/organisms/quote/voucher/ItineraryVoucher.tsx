import { useState } from 'react';

import { CircularProgress } from '@material-ui/core';
import ChevronLeftRoundedIcon from '@material-ui/icons/ChevronLeftRounded';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import JSPDF, { HTMLOptions, jsPDF } from 'jspdf';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

import VoucherGuestTable from './specific-voucher/VoucherGuestTable';
import VoucherSummary from './specific-voucher/VoucherSummary';
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

const storage = getStorage();

interface ItineraryVoucherProps {
  voucherData: any;
  setIsVoucherApproved: any;
}

function ItineraryVoucher({ voucherData, setIsVoucherApproved }: ItineraryVoucherProps) {
  const width = useSelector(selectWithNavbarWidth);

  const { id } = useParams<{ id: string }>();
  const [quoteNo] = useState(id.split('+')[1]);
  const [vData, setVData] = useState(voucherData[quoteNo].find((voucher: { id: string }) => (
    voucher.id === id.split('+')[0]
  )));

  const [director, setDirector] = useState(vData.director || '');

  const [isSavingVoucher, setIsSavingVoucher] = useState(false);

  const history = useHistory();

  interface DocDefinition {
    pageSize: string;
    pageOrientation: string;
    pageMargins: number[];
    content: any[];
  }
  const generatePDF = async () => {
    const { elementWidth, elementHeight } = getElementWidth('report');
    const report = new JSPDF('portrait', 'pt', [elementWidth, elementHeight]);
    const options = {
      scale: 0.5,
      allowTaint: true,
      letterRendering: true,
      svgRendering: true,
    };
    const contentWidth = elementWidth * 0.5;
    const contentHeight = elementHeight * 0.5;
    return report.html(document.querySelector('#report') as HTMLElement, {
      autoPaging: 'text',
      margin: [20, 20, 20, 20],
      x: contentWidth,
      y: contentHeight,
      html2canvas: options,
    }).then(async () => {
      const filename = `${vData.guestDetails.quoteNo}-${vData.guestDetails.name}.pdf`;
      const pdfURL = await uploadPDF(storage, 'voucher-tour-confirmation-pdfs', report.output('blob'), filename);
      report.save(filename);
      return pdfURL;
    });
  };
  /*
 const generatePDF = () => {
    const { elementWidth, elementHeight } = getElementWidth('report');
    const report = new JSPDF('p', 'pt', [elementWidth, elementHeight]);
    const htmlContent = document.querySelector('#report') as HTMLElement;
    const options = {
      pagesplit: true,
      margin: [20, 20, 20, 20],
      html2canvas: {
        scale: 2,
        letterRendering: true,
        useCORS: true,
      },
      jsPDF: {
        unit: 'pt',
        format: 'a4',
        orientation: 'potrait',
        CapJoinStyles: 0,
        version: '1.5.3',
        compatAPI: '1.4',
        advancedAPI: true,
        isAdvancedAPI: true,
      },
    };
    report.html(htmlContent, options).then(() => {
      const filename = `${vData.guestDetails.quoteNo}-${vData.guestDetails.name}.pdf`;
      const pdfURL = uploadPDF(storage, 'voucher-itnerary-pdfs', report.output('blob'), filename);
      report.save(filename);
      return pdfURL;
    });
  };
  */

  const saveVoucher = async () => {
    setIsSavingVoucher(true);
    setIsVoucherApproved(false);
    const pdfURL = await generatePDF();
    const vDataCopy = { ...vData };
    vDataCopy.pdfURL = pdfURL;
    vDataCopy.director = director;
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
        <H2Atom style={voucherStyles.title} text="Itinerary Voucher" />
      </DivAtom>

      <div id="report">
        <DivAtom style={{ padding: '2rem' }}>
          <Banner />
          <VoucherSummary vData={vData} type="itinerary" />
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
              {/* <p style={voucherStyles.voucherTemplate.summaryDetails.detailContainer}>
              <SpanAtom
                text="Payment"
                style={voucherStyles.voucherTemplate.summaryDetails.label}
              />
              <SpanAtom
                text={vData.guestDetails.netPrice}
                style={voucherStyles.voucherTemplate.summaryDetails.detail}
              />
            </p> */}
              <p style={voucherStyles.voucherTemplate.summaryDetails.detailContainer}>
                <SpanAtom
                  text="Selling Price"
                  style={voucherStyles.voucherTemplate.summaryDetails.label}
                />
                <SpanAtom
                  text={`$${vData.guestDetails.costings.sellingPrice}`}
                  style={{ ...voucherStyles.voucherTemplate.summaryDetails.detail, letterSpacing: '2px' }}
                />
              </p>
              <p style={voucherStyles.voucherTemplate.summaryDetails.detailContainer}>
                <SpanAtom
                  text="Discounted Price"
                  style={voucherStyles.voucherTemplate.summaryDetails.label}
                />
                <SpanAtom
                  text={`$${Number(vData.guestDetails.costings.sellingPrice) - Number(vData.guestDetails.costings.discount)}`}
                  style={{ ...voucherStyles.voucherTemplate.summaryDetails.detail, letterSpacing: '2px' }}
                />
              </p>
            </DivAtom>
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

      <DivAtom style={{ padding: '0.5rem 0' }}>
        <ButtonAtom
          size="large"
          text="Confirm"
          endIcon={isSavingVoucher && <CircularProgress size={20} color="inherit" />}
          disabled={isSavingVoucher || director === ''}
          onClick={saveVoucher}
        />
      </DivAtom>
    </>
  );
}

export default ItineraryVoucher;
function html2canvas(arg0: HTMLElement) {
  throw new Error('Function not implemented.');
}
