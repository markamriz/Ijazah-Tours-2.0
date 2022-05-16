import { useEffect, useState } from 'react';

import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';

import DivAtom from '../../../atoms/DivAtom';
import UnorderedListAtom from '../../../atoms/UnorderedListAtom';
import { db } from '../../../firebase';
import SectionContainer from '../../../organisms/settings/SectionContainer';
import SingleInputDialog from '../../../organisms/settings/SingleInputDialog';
import ReminderInputDialog from '../../../organisms/settings/tour/ReminderInputDialog';
import ReminderTable from '../../../organisms/settings/tour/ReminderTable';
import { selectWithNavbarHeight, selectWithNavbarWidth } from '../../../redux/containerSizeSlice';
import { settingsStyles } from '../../../styles';
import { SettingsReminder, SettingsSingleInput } from '../../../utils/types';

const INPUT_TYPES = [
  {
    h2Text: 'Holiday Types',
    btnNewText: 'Add Holiday Type',
    btnEditText: 'Edit Holiday Type',
  },
  {
    h2Text: 'Status',
    btnNewText: 'Add status',
    btnEditText: 'Edit status',
  },
  {
    h2Text: 'Comments',
    btnNewText: 'Add Comment',
    btnEditText: 'Edit Comment',
  },
];

function listRender(data: DocumentData[][], index: number) {
  if (index === 0) {
    return data[0] as SettingsSingleInput[];
  }

  if (index === 1) {
    return data[1] as SettingsSingleInput[];
  }

  return data[2] as SettingsSingleInput[];
}

function Tour() {
  const height = useSelector(selectWithNavbarHeight);
  const width = useSelector(selectWithNavbarWidth);

  const [singleInputsData, setSingleInputsData] = useState<DocumentData[][]>([]);
  const [newSingleInput, setNewSingleInput] = useState('');
  const [editSingleInput, setEditSingleInput] = useState('');

  const [reminderData, setReminderData] = useState<DocumentData[]>([]);
  const [newReminderTitle, setNewReminderTitle] = useState('');
  const [newReminderDesc, setNewReminderDesc] = useState('');
  const [newReminderTypes, setNewReminderTypes] = useState<boolean[]>(new Array(3).fill(false));
  const [editReminderTitle, setEditReminderTitle] = useState('');
  const [editReminderDesc, setEditReminderDesc] = useState('');
  const [editReminderTypes, setEditReminderTypes] = useState<boolean[]>(new Array(3).fill(false));

  const [editId, setEditId] = useState('');

  const [openNewDialogs, setOpenNewDialogs] = useState<boolean[]>(new Array(3).fill(false));
  const [openEditDialogs, setOpenEditDialogs] = useState<boolean[]>(new Array(3).fill(false));
  const [openNewReminderDialog, setOpenNewReminderDialog] = useState(false);
  const [openEditReminderDialog, setOpenEditReminderDialog] = useState(false);

  const [showValidationErrorMessage, setShowValidationErrorMessage] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const getInitialData = async () => {
      const singleData = await Promise.all(
        INPUT_TYPES.map(async (type) => {
          const sData = (await getDocs(collection(db, `Settings ${type.h2Text}`))).docs;
          const data = sData.map((dc) => dc.data());
          const ids = sData.map((dc) => dc.id);
          ids.forEach((id, i) => {
            data[i].id = id;
          });
          return data;
        }),
      );

      const rData = (await getDocs(collection(db, 'Settings Reminders'))).docs;
      const reminders = rData.map((dc) => dc.data());
      const reminderIds = rData.map((dc) => dc.id);
      reminderIds.forEach((id, i) => {
        reminders[i].id = id;
      });
      setReminderData(reminders);
      setSingleInputsData(singleData);
    };

    getInitialData();
  }, [isCreating, isDeleting, isUpdating]);

  const onCreateSingleInput = async (type: string, i: number) => {
    setShowValidationErrorMessage(false);
    if (newSingleInput.trim() === '') {
      setShowValidationErrorMessage(true);
      return;
    }

    setIsCreating(true);
    await setDoc(doc(db, `Settings ${type}`, uuid()), {
      type,
      val: newSingleInput,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    setNewSingleInput('');
    setIsCreating(false);
    onOpenNewDialog(i);
  };

  const onEditSingleInput = async (type: string, i: number) => {
    setShowValidationErrorMessage(false);
    if (editSingleInput.trim() === '') {
      setShowValidationErrorMessage(true);
      return;
    }

    setIsUpdating(true);
    await updateDoc(doc(db, `Settings ${type}`, editId), {
      type,
      val: editSingleInput,
      updatedAt: serverTimestamp(),
    });
    setIsUpdating(false);
    onOpenEditDialog(i);
  };

  const onDeleteSingleInput = async (type: string, id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (confirmDelete) {
      setIsDeleting(false);
      await deleteDoc(doc(db, `Settings ${type}`, id));
      setIsDeleting(true);
    }
  };

  const onCreateReminder = async () => {
    setShowValidationErrorMessage(false);
    if (newReminderTitle.trim() === '' || newReminderDesc.trim() === '') {
      setShowValidationErrorMessage(true);
      return;
    }

    setIsCreating(true);
    // eslint-disable-next-line no-nested-ternary
    const type = newReminderTypes[0] ? 'Creation of Customer' : newReminderTypes[2] ? 'Approval of Quote' : 'Creation of Quotation';
    await setDoc(doc(db, 'Settings Reminders', uuid()), {
      title: newReminderTitle,
      description: newReminderDesc,
      type,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    clearReminderInputs();
    setIsCreating(false);
    setOpenNewReminderDialog(false);
  };

  const clearReminderInputs = () => {
    setNewReminderTitle('');
    setNewReminderDesc('');
  };

  const onEditReminder = async () => {
    setShowValidationErrorMessage(false);
    if (editReminderTitle.trim() === '' || editReminderDesc.trim() === '') {
      setShowValidationErrorMessage(true);
      return;
    }

    setIsUpdating(true);
    // eslint-disable-next-line no-nested-ternary
    const type = newReminderTypes[0] ? 'Creation of Customer' : newReminderTypes[2] ? 'Approval of Quote' : 'Creation of Quotation';
    await updateDoc(doc(db, 'Settings Reminders', editId), {
      title: editReminderTitle,
      description: editReminderDesc,
      type,
      updatedAt: serverTimestamp(),
    });
    setIsUpdating(false);
    setOpenEditReminderDialog(false);
  };

  const deleteReminder = async (row: SettingsReminder) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (confirmDelete) {
      setIsDeleting(false);
      await deleteDoc(doc(db, 'Settings Reminders', row.id));
      setIsDeleting(true);
    }
  };

  const onEditItemClick = (i: number, id: string) => {
    const input = singleInputsData[i].find((inp) => inp.id === id);
    setEditSingleInput((input as { val: string }).val);
    setEditId((input as { id: string }).id);
    onOpenEditDialog(i);
  };

  const onEditReminderClick = (row: SettingsReminder) => {
    const type = row.type.includes('Customer') ? [true, false] : [false, true];
    setOpenEditReminderDialog(true);
    setEditReminderTitle(row.title);
    setEditReminderTypes(type);
    setEditId(row.id);
    setEditReminderDesc(row.description);
  };

  const onOpenNewDialog = (i: number) => {
    setNewSingleInput('');
    const updatedOpenDialogs = openNewDialogs.map((open, index) => (index === i ? !open : open));
    setOpenNewDialogs(updatedOpenDialogs);
    setShowValidationErrorMessage(false);
  };

  const onOpenEditDialog = (i: number) => {
    const updatedOpenDialogs = openEditDialogs.map((open, index) => (index === i ? !open : open));
    setOpenEditDialogs(updatedOpenDialogs);
    setShowValidationErrorMessage(false);
  };

  const onChangeNewReminderType = (i: number) => {
    const updatedCheckedState = newReminderTypes.map((type, index) => (index === i ? !type : type));
    setNewReminderTypes(updatedCheckedState);
    setShowValidationErrorMessage(false);
  };

  const onChangeEditReminderType = (i: number) => {
    const updatedCheckedState = editReminderTypes.map((type, index) => (
      index === i ? !type : type
    ));

    setEditReminderTypes(updatedCheckedState);
    setShowValidationErrorMessage(false);
  };

  return (
    <DivAtom style={settingsStyles.container}>
      <DivAtom
        style={{
          ...settingsStyles.innerContainer,
          height: `${height}px`,
        }}
      >
        {singleInputsData[0] !== undefined && INPUT_TYPES.map((type, index) => (
          <DivAtom key={index} style={{ marginBottom: '3rem' }}>
            <SectionContainer
              width={width}
              h2Text={type.h2Text}
              btnText={type.btnNewText}
              setOpenDialog={() => onOpenNewDialog(index)}
            />
            {/* Create Item Dialog */}
            <SingleInputDialog
              title={type.btnNewText}
              newInput={newSingleInput}
              showValidationErrorMessage={showValidationErrorMessage}
              isCreating={isCreating}
              onChange={(val: string) => setNewSingleInput(val)}
              openDialog={openNewDialogs[index]}
              setOpenDialog={() => onOpenNewDialog(index)}
              onEditCreate={() => onCreateSingleInput(type.h2Text, index)}
            />
            {/* Edit Item Dialog */}
            <SingleInputDialog
              title={type.btnEditText}
              showValidationErrorMessage={showValidationErrorMessage}
              isCreating={isUpdating}
              newInput={editSingleInput}
              onChange={(val: string) => setEditSingleInput(val)}
              openDialog={openEditDialogs[index]}
              setOpenDialog={() => onOpenEditDialog(index)}
              onEditCreate={() => onEditSingleInput(type.h2Text, index)}
            />
            <UnorderedListAtom
              type={type.h2Text}
              onEditItem={(_, _id) => onEditItemClick(index, _id)}
              onDeleteItem={(tp, _id) => onDeleteSingleInput(tp, _id)}
              allChildren={listRender(singleInputsData, index)}
            />
          </DivAtom>
        ))}

        <DivAtom style={{ marginBottom: '3rem' }}>
          <SectionContainer
            width={width}
            h2Text="Auto Generated Reminders"
            btnText="Add Reminder"
            setOpenDialog={() => setOpenNewReminderDialog(true)}
          />
          {/* Add Reminder */}
          <ReminderInputDialog
            title="Add Reminder"
            showValidationErrorMessage={showValidationErrorMessage}
            isCreating={isCreating}
            newTitle={newReminderTitle}
            newDesc={newReminderDesc}
            setNewTitle={setNewReminderTitle}
            setNewDesc={setNewReminderDesc}
            reminderTypes={newReminderTypes}
            openDialog={openNewReminderDialog}
            setOpenDialog={() => setOpenNewReminderDialog(false)}
            onAddEdit={onCreateReminder}
            onChangeReminderType={(i: number) => onChangeNewReminderType(i)}
          />
          {/* Edit Reminder */}
          <ReminderInputDialog
            title="Edit Reminder"
            showValidationErrorMessage={showValidationErrorMessage}
            isCreating={isUpdating}
            newTitle={editReminderTitle}
            newDesc={editReminderDesc}
            setNewTitle={setEditReminderTitle}
            setNewDesc={setEditReminderDesc}
            reminderTypes={editReminderTypes}
            openDialog={openEditReminderDialog}
            setOpenDialog={() => setOpenEditReminderDialog(false)}
            onAddEdit={onEditReminder}
            onChangeReminderType={(i: number) => onChangeEditReminderType(i)}
          />
          <DivAtom style={{ marginTop: '1rem' }}>
            {reminderData[0] && (
              <ReminderTable
                columns={['TITLE', 'DESCRIPTION', 'TYPE', '', '']}
                data={reminderData as SettingsReminder[]}
                deleteReminder={deleteReminder}
                onEditReminderClick={onEditReminderClick}
              />
            )}
          </DivAtom>
        </DivAtom>
      </DivAtom>
    </DivAtom>
  );
}

export default Tour;
