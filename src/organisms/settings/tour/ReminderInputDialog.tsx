import { MouseEventHandler } from 'react';

import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';

import ButtonAtom from '../../../atoms/ButtonAtom';
import ParagraphAtom from '../../../atoms/ParagraphAtom';
import CheckboxGroup from '../../../molecules/CheckboxGroup';
import FormControlInput from '../../../molecules/FormControlInput';
import {
  settingsStyles,
  TableToolbarStyles,
} from '../../../styles';

interface ReminderInputDialogProps {
  title: string;
  newTitle: string;
  newDesc: string;
  reminderTypes: boolean[];
  openDialog: boolean;
  showValidationErrorMessage: boolean;
  isCreating: boolean;
  onAddEdit: MouseEventHandler<HTMLButtonElement>;
  onChangeReminderType: (i: number) => void;
  setNewTitle: any;
  setNewDesc: any;
  setOpenDialog: any;
}

function ReminderInputDialog({
  title,
  newTitle,
  newDesc,
  reminderTypes,
  openDialog,
  showValidationErrorMessage,
  isCreating,
  setOpenDialog,
  setNewTitle,
  setNewDesc,
  onAddEdit,
  onChangeReminderType,
}: ReminderInputDialogProps) {
  return (
    <>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle style={settingsStyles.title}>{title}</DialogTitle>
        <DialogContent style={settingsStyles.multiFieldDialogContainer}>
          <CheckboxGroup
            groupTitle="Reminder Type"
            labels={['Creation of Customer', 'Creation of Quote', 'Approval of Quote']}
            names={['customer', 'quote', 'approval']}
            checked={reminderTypes}
            onChange={(_, i: number) => onChangeReminderType(i)}
            style={{ flexDirection: 'column', margin: '0' }}
          />
          <FormControlInput
            label="Reminder Title"
            fullWidth
            multiline={false}
            rows={1}
            value={newTitle}
            placeholder="Enter Reminder Title"
            setValue={setNewTitle}
            margin="0 0 1rem 0"
            flex={1}
          />
          <FormControlInput
            label="Reminder Description"
            fullWidth
            multiline={false}
            rows={1}
            value={newDesc}
            placeholder="Enter Reminder Description"
            setValue={setNewDesc}
            margin="0 0 1rem 0"
            flex={1}
          />
          {showValidationErrorMessage && (
            <ParagraphAtom
              text="Please fill in all the fields"
              style={{ color: 'red', textAlign: 'center' }}
            />
          )}
          <ButtonAtom
            endIcon={isCreating && <CircularProgress size={20} color="inherit" />}
            size="large"
            disabled={isCreating}
            text={title}
            onClick={onAddEdit}
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

export default ReminderInputDialog;
