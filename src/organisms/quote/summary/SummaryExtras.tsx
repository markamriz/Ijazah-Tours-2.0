import { MouseEventHandler } from 'react';

import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';

import ExtrasTable from './ExtrasTable';
import ButtonAtom from '../../../atoms/ButtonAtom';
import DivAtom from '../../../atoms/DivAtom';
import ParagraphAtom from '../../../atoms/ParagraphAtom';
import FormControlInput from '../../../molecules/FormControlInput';
import { libraryAccomodationStyles, TableToolbarStyles } from '../../../styles';
import { widthHeightDynamicStyle } from '../../../utils/helpers';
import { FlexDirection } from '../../../utils/types';

interface SummaryExtrasProps {
  width: number;
  newEXTitle: string;
  newEXRemark: string
  newEXUSDPrice: string;
  newEXLKRPrice: string;
  newEXEXRate: string;
  onCreate: MouseEventHandler<HTMLButtonElement>;
  onDelete: any;
  extrasData: any;
  setNewEXTitle: any;
  setNewEXEXRate: any;
  setNewEXRemark: any;
  setNewEXUSDPrice: any;
  setNewEXLKRPrice: any;
}

function SummaryExtras({
  width,
  newEXTitle,
  newEXRemark,
  newEXUSDPrice,
  newEXLKRPrice,
  newEXEXRate,
  onCreate,
  onDelete,
  extrasData,
  setNewEXTitle,
  setNewEXEXRate,
  setNewEXRemark,
  setNewEXUSDPrice,
  setNewEXLKRPrice,
}: SummaryExtrasProps) {
  return (
    <>
      <ParagraphAtom text="Extras" style={{ marginTop: '2rem' }} />
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
          value={newEXTitle}
          setValue={setNewEXTitle}
          placeholder="Enter Title"
        />
        <FormControlInput
          margin={widthHeightDynamicStyle(width, 1000, '0 0 1rem 0', '0 1rem 1rem 0') as string}
          flex={1}
          label="Remark"
          fullWidth
          multiline={false}
          rows={1}
          value={newEXRemark}
          setValue={setNewEXRemark}
          placeholder="Enter Remark"
        />
        <FormControlInput
          margin={widthHeightDynamicStyle(width, 1000, '0 0 1rem 0', '0 1rem 1rem 0') as string}
          flex={1}
          label="Price"
          fullWidth
          multiline={false}
          rows={1}
          value={newEXUSDPrice}
          setValue={setNewEXUSDPrice}
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
          value={newEXLKRPrice}
          setValue={setNewEXLKRPrice}
          placeholder="Enter Price (LKR)"
        />
        <FormControlInput
          margin="0 0 1rem 0"
          flex={1}
          label="EX Rate"
          fullWidth
          multiline={false}
          rows={1}
          value={newEXEXRate}
          setValue={setNewEXEXRate}
          placeholder="Enter EX Rate"
        />
        <ButtonAtom
          startIcon={<AddCircleOutlineOutlinedIcon />}
          text="Add"
          disabled={
            newEXTitle === ''
            || newEXRemark === ''
            || newEXUSDPrice === ''
            || newEXLKRPrice === ''
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
        {extrasData.length > 0 && (
          <>
            <ExtrasTable
              data={extrasData}
              columns={['TITLE', 'REMARK', 'PRICE ($)', 'PRICE (LKR)', 'EX RATE', '']}
              deleteExtras={onDelete}
            />
          </>
        )}
      </DivAtom>
    </>
  );
}

export default SummaryExtras;
