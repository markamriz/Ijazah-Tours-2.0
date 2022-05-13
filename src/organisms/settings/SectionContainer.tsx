import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';

import ButtonAtom from '../../atoms/ButtonAtom';
import DivAtom from '../../atoms/DivAtom';
import H2Atom from '../../atoms/H2Atom';
import { settingsStyles, TableToolbarStyles } from '../../styles';
import { widthHeightDynamicStyle } from '../../utils/helpers';
import { FlexDirection } from '../../utils/types';

interface SectionContainerProps {
  width: number;
  h2Text: string;
  btnText: string;
  setOpenDialog: any;
}

function SectionContainer({
  width,
  h2Text,
  btnText,
  setOpenDialog,
}: SectionContainerProps) {
  return (
    <DivAtom
      style={{
        ...settingsStyles.multiFieldContainer,
        flexDirection: widthHeightDynamicStyle(width, 1000, 'column', 'row') as FlexDirection,
        marginTop: '1rem',
      }}
    >
      <H2Atom style={{ ...settingsStyles.title, fontSize: '1.2rem' }} text={h2Text} />
      <ButtonAtom
        startIcon={<AddCircleOutlineOutlinedIcon />}
        text={btnText}
        onClick={setOpenDialog}
        style={{
          ...TableToolbarStyles.addBtn,
          width: widthHeightDynamicStyle(width, 1000, '100%', '16rem'),
          height: '3rem',
          marginLeft: widthHeightDynamicStyle(width, 1000, 0, '1rem'),
          marginBottom: widthHeightDynamicStyle(width, 1000, '1rem', 0),
        }}
        size="large"
      />
    </DivAtom>
  );
}

export default SectionContainer;
