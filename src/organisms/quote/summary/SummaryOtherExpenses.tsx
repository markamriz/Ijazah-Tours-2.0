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
import OtherExpensesTable from './OtherExpensesTable';

interface SummaryOtherExpensesProps {
  width: number;
  newOTTitle: string;
  newOTRemark: string
  newOTUSDPrice: string;
  newOTLKRPrice: string;
  newOTEXRate: string;
  lkrOTTotal: string;
  usdOTTotal: string;
  lkrTotalExpenseTotal: string;
  usdTotalExpenseTotal: string;
  onCreate: MouseEventHandler<HTMLButtonElement>;
  onDelete: any;
  otherExpenseData: any;
  setNewOTEXRate: any;
  setNewOTTitle: any;
  setNewOTRemark: any;
  setNewOTUSDPrice: any;
  setNewOTLKRPrice: any;
}

function SummaryOtherExpenses({
  width,
  newOTTitle,
  newOTRemark,
  newOTUSDPrice,
  newOTLKRPrice,
  newOTEXRate,
  lkrOTTotal,
  usdOTTotal,
  lkrTotalExpenseTotal,
  usdTotalExpenseTotal,
  onCreate,
  onDelete,
  otherExpenseData,
  setNewOTEXRate,
  setNewOTTitle,
  setNewOTRemark,
  setNewOTUSDPrice,
  setNewOTLKRPrice,
}: SummaryOtherExpensesProps) {
  return (
    <>
      <ParagraphAtom text="Other Expenses" style={summaryStyles.sectionTitle} />
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
          value={newOTTitle}
          setValue={setNewOTTitle}
          placeholder="Enter Title"
        />
        <FormControlInput
          margin={widthHeightDynamicStyle(width, 1000, '0 0 1rem 0', '0 1rem 1rem 0') as string}
          flex={1}
          label="Remark"
          fullWidth
          multiline={false}
          rows={1}
          value={newOTRemark}
          setValue={setNewOTRemark}
          placeholder="Enter Remark"
        />
        <FormControlInput
          margin={widthHeightDynamicStyle(width, 1000, '0 0 1rem 0', '0 1rem 1rem 0') as string}
          flex={1}
          label="Price"
          fullWidth
          multiline={false}
          rows={1}
          value={newOTUSDPrice}
          setValue={setNewOTUSDPrice}
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
          value={newOTLKRPrice}
          setValue={setNewOTLKRPrice}
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
          value={newOTEXRate}
          setValue={setNewOTEXRate}
          placeholder="Enter EX Rate"
        />
        <ButtonAtom
          startIcon={<AddCircleOutlineOutlinedIcon />}
          text="Add"
          disabled={
            newOTTitle === ''
            || newOTRemark === ''
            || newOTUSDPrice === ''
            || newOTLKRPrice === ''
            || newOTEXRate === ''
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
        {otherExpenseData.length > 0 && (
          <>
            <OtherExpensesTable
              data={otherExpenseData}
              columns={['TITLE', 'REMARK', 'PRICE ($)', 'PRICE (LKR)', 'EX RATE', '']}
              deleteExpense={onDelete}
            />
            <p style={summaryStyles.tableOverallRates.detailContainer}>
              <SpanAtom
                text="Other Expenses"
                style={summaryStyles.tableOverallRates.label}
              />
              <SpanAtom
                text={usdOTTotal}
                style={summaryStyles.tableOverallRates.usdValue}
              />
              <SpanAtom
                text={lkrOTTotal}
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
          </>
        )}
      </DivAtom>
    </>
  );
}

export default SummaryOtherExpenses;
