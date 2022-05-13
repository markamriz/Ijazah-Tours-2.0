import { MouseEventHandler } from 'react';

import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';

import ButtonAtom from '../../../atoms/ButtonAtom';
import DivAtom from '../../../atoms/DivAtom';
import ParagraphAtom from '../../../atoms/ParagraphAtom';
import SpanAtom from '../../../atoms/SpanAtom';
import FormControlInput from '../../../molecules/FormControlInput';
import { libraryAccomodationStyles, summaryStyles, TableToolbarStyles } from '../../../styles';
import { widthHeightDynamicStyle } from '../../../utils/helpers';
import { FlexDirection } from '../../../utils/types';
import EarningsTable from './EarningsTable';

interface SummaryEarningsProps {
  width: number;
  newERTitle: string;
  newERRemark: string
  newERUSDPrice: string;
  newERLKRPrice: string;
  newEREXRate: string;
  lkrEarningTotal: string;
  usdEarningTotal: string;
  lkrEarningNetProfit: string;
  usdEarningNetProfit: string;
  lkrTotalExpenseTotal: string;
  usdTotalExpenseTotal: string;
  onCreate: MouseEventHandler<HTMLButtonElement>;
  onDelete: any;
  earningsData: any;
  setNewERTitle: any;
  setNewEREXRate: any;
  setNewERRemark: any;
  setNewERUSDPrice: any;
  setNewERLKRPrice: any;
}

function SummaryEarnings({
  width,
  newERTitle,
  newERRemark,
  newERUSDPrice,
  newERLKRPrice,
  newEREXRate,
  lkrEarningTotal,
  usdEarningTotal,
  lkrEarningNetProfit,
  usdEarningNetProfit,
  lkrTotalExpenseTotal,
  usdTotalExpenseTotal,
  onCreate,
  onDelete,
  earningsData,
  setNewERTitle,
  setNewEREXRate,
  setNewERRemark,
  setNewERUSDPrice,
  setNewERLKRPrice,
}: SummaryEarningsProps) {
  return (
    <>
      <ParagraphAtom text="Earnings" style={summaryStyles.sectionTitle} />
      <DivAtom
        style={{
          ...libraryAccomodationStyles.multiFieldContainer,
          flexDirection: widthHeightDynamicStyle(width, 1000, 'column', 'row') as FlexDirection,
        }}
      >
        <FormControlInput
          margin={widthHeightDynamicStyle(width, 1000, '0 0 1rem 0', '0 1rem 1rem 0') as string}
          flex={1}
          label="Title"
          fullWidth
          multiline={false}
          rows={1}
          value={newERTitle}
          setValue={setNewERTitle}
          placeholder="Enter Title"
        />
        <FormControlInput
          margin={widthHeightDynamicStyle(width, 1000, '0 0 1rem 0', '0 1rem 1rem 0') as string}
          flex={1}
          label="Remark"
          fullWidth
          multiline={false}
          rows={1}
          value={newERRemark}
          setValue={setNewERRemark}
          placeholder="Enter Remark"
        />
        <FormControlInput
          margin={widthHeightDynamicStyle(width, 1000, '0 0 1rem 0', '0 1rem 1rem 0') as string}
          flex={1}
          label="Price"
          fullWidth
          multiline={false}
          rows={1}
          value={newERUSDPrice}
          setValue={setNewERUSDPrice}
          placeholder="Enter Price ($)"
          dollarAdornment
        />
        <FormControlInput
          margin={widthHeightDynamicStyle(width, 1000, '0 0 1rem 0', '0 1rem 1rem 0') as string}
          flex={1}
          label="Price"
          fullWidth
          multiline={false}
          rows={1}
          value={newERLKRPrice}
          setValue={setNewERLKRPrice}
          placeholder="Enter Price (LKR)"
          lkrAdornment
        />
        <FormControlInput
          margin="0 0 1rem 0"
          flex={1}
          label="EX Rate"
          fullWidth
          multiline={false}
          rows={1}
          value={newEREXRate}
          setValue={setNewEREXRate}
          placeholder="Enter EX Rate"
        />
        <ButtonAtom
          startIcon={<AddCircleOutlineOutlinedIcon />}
          text="Add"
          disabled={
            newERTitle === ''
            || newERRemark === ''
            || newERUSDPrice === ''
            || newERLKRPrice === ''
            || newEREXRate === ''
          }
          onClick={(event) => onCreate(event)}
          style={{
            ...TableToolbarStyles.addBtn,
            width: widthHeightDynamicStyle(width, 540, '100%', 'auto'),
            height: '3rem',
            marginLeft: widthHeightDynamicStyle(width, 1000, 0, '1rem') as string,
            marginBottom: widthHeightDynamicStyle(width, 1000, '1rem', 0) as string,
          }}
          size="large"
        />
      </DivAtom>
      <DivAtom>
        {earningsData.length > 0 && (
          <>
            <EarningsTable
              data={earningsData}
              columns={['TITLE', 'REMARK', 'PRICE ($)', 'PRICE (LKR)', 'EX RATE', '']}
              deleteEarnings={onDelete}
            />
            <p style={summaryStyles.tableOverallRates.detailContainer}>
              <SpanAtom
                text="Earnings"
                style={summaryStyles.tableOverallRates.label}
              />
              <SpanAtom
                text={usdEarningTotal}
                style={summaryStyles.tableOverallRates.usdValue}
              />
              <SpanAtom
                text={lkrEarningTotal}
                style={summaryStyles.tableOverallRates.lkrValue}
              />
            </p>
            <p style={summaryStyles.tableOverallRates.detailContainer}>
              <SpanAtom
                text="Total Expense"
                style={summaryStyles.tableOverallRates.label}
              />
              <SpanAtom
                text={usdTotalExpenseTotal}
                style={summaryStyles.tableOverallRates.usdValue}
              />
              <SpanAtom
                text={lkrTotalExpenseTotal}
                style={summaryStyles.tableOverallRates.lkrValue}
              />
            </p>
            <p style={summaryStyles.tableOverallRates.detailContainer}>
              <SpanAtom
                text="Net Profit"
                style={summaryStyles.tableOverallRates.label}
              />
              <SpanAtom
                text={usdEarningNetProfit}
                style={summaryStyles.tableOverallRates.usdValue}
              />
              <SpanAtom
                text={lkrEarningNetProfit}
                style={summaryStyles.tableOverallRates.lkrValue}
              />
            </p>
          </>
        )}
      </DivAtom>
    </>
  );
}

export default SummaryEarnings;
