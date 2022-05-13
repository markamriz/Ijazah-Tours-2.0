import DivAtom from '../../../../../atoms/DivAtom';
import FormControlInput from '../../../../../molecules/FormControlInput';
import { quoteCreateQuoteStyles } from '../../../../../styles';
import { widthHeightDynamicStyle } from '../../../../../utils/helpers';
import { FlexDirection } from '../../../../../utils/types';

interface CostingTransportProps {
  width: number;
  rate: string;
  days: string;
  transport: string;
  setRate: any;
  setDays: any;
  setTransport: any;
}

function CostingTransport({
  width,
  rate,
  days,
  transport,
  setRate,
  setDays,
  setTransport,
}: CostingTransportProps) {
  return (
    <DivAtom
      style={{
        ...quoteCreateQuoteStyles.multiFieldContainer,
        ...quoteCreateQuoteStyles.tableContainer,
        flexDirection: widthHeightDynamicStyle(width, 600, 'column', 'row') as FlexDirection,
      }}
    >
      <DivAtom
        style={{
          display: 'flex',
          flexDirection: widthHeightDynamicStyle(width, 600, 'column', 'row') as FlexDirection,
        }}
      >
        <FormControlInput
          label="Rate"
          fullWidth
          multiline={false}
          rows={1}
          value={rate}
          setValue={setRate}
          placeholder="Enter Rate"
          flex={widthHeightDynamicStyle(width, 600, 1, undefined) as number | undefined}
          margin={widthHeightDynamicStyle(width, 600, '0 0 1rem 0', '0 1rem 1rem 0') as string}
          dollarAdornment
        />
        <FormControlInput
          label="Days"
          fullWidth
          disabled
          multiline={false}
          rows={1}
          value={days}
          flex={widthHeightDynamicStyle(width, 600, 1, undefined) as number | undefined}
          setValue={setDays}
          placeholder="Enter Days"
          margin={widthHeightDynamicStyle(width, 600, '0 0 1rem 0', 0) as string}
        />
      </DivAtom>
      <DivAtom
        style={{
          display: 'flex',
          flexDirection: widthHeightDynamicStyle(width, 600, 'column', 'row') as FlexDirection,
        }}
      >
        <FormControlInput
          label="Transport"
          fullWidth
          multiline={false}
          rows={1}
          value={transport}
          setValue={setTransport}
          flex={widthHeightDynamicStyle(width, 600, 1, undefined) as number | undefined}
          placeholder="Enter Transport"
          dollarAdornment
        />
      </DivAtom>
    </DivAtom>
  );
}

export default CostingTransport;
