import { MouseEventHandler } from 'react';

import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';

import ButtonAtom from '../../../atoms/ButtonAtom';
import ParagraphAtom from '../../../atoms/ParagraphAtom';
import TextFieldAtom from '../../../atoms/TextFieldAtom';
import FormControlInput from '../../../molecules/FormControlInput';
import {
  settingsStyles,
  TableToolbarStyles,
} from '../../../styles';
import { roleOptions } from '../../../utils/helpers';
import { Role } from '../../../utils/types';

interface UMTeamMemberDialogProps {
  btnText: string;
  newFirstname: string;
  newLastname: string;
  newRole: Role;
  openDialog: boolean;
  showValidationErrorMessage: boolean;
  isCreating: boolean;
  onEditCreateMember: MouseEventHandler<HTMLButtonElement>;
  setOpenDialog: any;
  setNewFirstname: any;
  setNewLastname: any;
  setNewRole: any;
  newPassword?: string;
  newEmail?: string;
  editDialog?: boolean;
  setNewEmail?: any;
  setNewPassword?: any;
}

function UMTeamMemberDialog({
  btnText,
  newFirstname,
  newLastname,
  newEmail,
  editDialog,
  newRole,
  newPassword,
  openDialog,
  showValidationErrorMessage,
  isCreating,
  setOpenDialog,
  setNewFirstname,
  setNewLastname,
  setNewEmail,
  setNewRole,
  setNewPassword,
  onEditCreateMember,
}: UMTeamMemberDialogProps) {
  return (
    <>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle style={settingsStyles.title}>{btnText}</DialogTitle>
        <DialogContent
          style={settingsStyles.multiFieldDialogContainer}
        >
          <FormControlInput
            flex={1}
            label="First Name"
            fullWidth
            multiline={false}
            rows={1}
            value={newFirstname}
            setValue={setNewFirstname}
            placeholder="Enter First Name"
          />
          <FormControlInput
            flex={1}
            label="Last Name"
            fullWidth
            multiline={false}
            rows={1}
            value={newLastname}
            setValue={setNewLastname}
            placeholder="Enter Last Name"
          />
          {!editDialog && (
            <>
              <FormControlInput
                flex={1}
                label="Email"
                fullWidth
                multiline={false}
                rows={1}
                value={newEmail!}
                setValue={setNewEmail}
                placeholder="Enter Email"
                type="email"
              />
              <FormControlInput
                flex={1}
                label="Password"
                fullWidth
                multiline={false}
                rows={1}
                value={newPassword!}
                setValue={setNewPassword}
                placeholder="Enter Password"
                type="password"
              />
            </>
          )}
          <TextFieldAtom
            variant="standard"
            size="medium"
            label="Role"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            options={roleOptions}
            adornmentPosition="end"
            disableUnderline={false}
            style={{ margin: '0.5rem 0 0 0' }}
            select
          />
          {showValidationErrorMessage && (
            <ParagraphAtom
              text="Please fill in all the fields"
              style={{ color: 'red', textAlign: 'center' }}
            />
          )}
          <ButtonAtom
            text={btnText}
            endIcon={isCreating && <CircularProgress size={20} color="inherit" />}
            size="large"
            disabled={isCreating}
            onClick={(event) => onEditCreateMember(event)}
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

export default UMTeamMemberDialog;
