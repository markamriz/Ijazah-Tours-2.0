import { MouseEvent } from 'react';

import ButtonAtom from '../../../../atoms/ButtonAtom';
import DivAtom from '../../../../atoms/DivAtom';
import FormControlInput from '../../../../molecules/FormControlInput';
import { quoteCreateQuoteStyles } from '../../../../styles';
import { widthHeightDynamicStyle } from '../../../../utils/helpers';

interface PresetFormProps {
  width: number;
  title: string;
  onCreateHoliday: (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
  setTitle: any;
}

function PresetForm({
  width,
  title,
  onCreateHoliday,
  setTitle,
}: PresetFormProps) {
  return (
    <DivAtom style={quoteCreateQuoteStyles.formContainer}>
      <FormControlInput
        margin={widthHeightDynamicStyle(width, 600, '0 0 1rem 0', '0 1rem 1rem 0') as string}
        flex={1}
        label="Title"
        fullWidth
        multiline={false}
        rows={1}
        value={title}
        setValue={setTitle}
        placeholder="Enter Title"
      />
      <DivAtom
        style={{
          ...quoteCreateQuoteStyles.addBtnContainer,
          padding: widthHeightDynamicStyle(width, 768, '1rem', 0),
          margin: widthHeightDynamicStyle(
            width,
            768,
            0,
            quoteCreateQuoteStyles.addBtnContainer.margin,
          ),
        }}
      >
        <ButtonAtom
          size="large"
          text="Continue"
          onClick={(event) => onCreateHoliday(event)}
          disabled={title.trim() === ''}
          style={{
            ...quoteCreateQuoteStyles.addBtn,
            width: widthHeightDynamicStyle(width, 768, '100%', '18%'),
            margin: '0 0 1rem 0',
          }}
        />
      </DivAtom>
    </DivAtom>
  );
}

export default PresetForm;
