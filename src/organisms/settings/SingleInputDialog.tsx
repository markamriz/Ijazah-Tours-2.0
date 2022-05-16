import { ChangeEvent, MouseEventHandler } from 'react';

import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
} from '@material-ui/core';

import ButtonAtom from '../../atoms/ButtonAtom';
import InputAtom from '../../atoms/InputAtom';
import ParagraphAtom from '../../atoms/ParagraphAtom';
import {
  settingsStyles,
  TableToolbarStyles,
} from '../../styles';

interface SingleInputDialogProps {
  title: string;
  newInput: string;
  openDialog: boolean;
  showValidationErrorMessage: boolean;
  isCreating: boolean;
  onEditCreate: MouseEventHandler<HTMLButtonElement>;
  onChange: (val: string) => void;
  setOpenDialog: any;
}

function SingleInputDialog({
  title,
  newInput,
  openDialog,
  showValidationErrorMessage,
  isCreating,
  onChange,
  setOpenDialog,
  onEditCreate,
}: SingleInputDialogProps) {
  return (
    <>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle style={settingsStyles.title}>{title}</DialogTitle>
        <DialogContent style={settingsStyles.multiFieldDialogContainer}>
          <FormControl>
            <InputLabel>{title.substring(4, title.length)}</InputLabel>
            <InputAtom
              plain="true"
              fullWidth
              multiline={false}
              rows={1}
              value={newInput}
              onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
              placeholder={`${title.substring(4, title.length)}`}
            />
          </FormControl>
          {showValidationErrorMessage && (
            <ParagraphAtom
              text="Please fill in all the fields"
              style={{ color: 'red', textAlign: 'center' }}
            />
          )}
          <ButtonAtom
            text={title}
            endIcon={isCreating && <CircularProgress size={20} color="inherit" />}
            size="large"
            disabled={isCreating}
            onClick={onEditCreate}
            style={{
              ...TableToolbarStyles.addBtn,
              marginTop: '1rem',
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default SingleInputDialog;
