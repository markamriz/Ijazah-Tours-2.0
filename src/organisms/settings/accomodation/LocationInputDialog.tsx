import { ChangeEvent, MouseEventHandler, useState } from 'react';

import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';
import { City } from 'country-state-city';
import { v4 as uuid } from 'uuid';

import ButtonAtom from '../../../atoms/ButtonAtom';
import InputAtom from '../../../atoms/InputAtom';
import ParagraphAtom from '../../../atoms/ParagraphAtom';
import {
  settingsStyles,
  TableToolbarStyles,
} from '../../../styles';
import { MenuProps } from '../../../utils/helpers';
import { LocationDropdown, CityDropdown } from '../../../utils/types';

interface LocationInputDialogProps {
  title: string;
  newLocation: LocationDropdown;
  newCities: CityDropdown[];
  openDialog: boolean;
  showValidationErrorMessage: boolean;
  isCreating: boolean;
  onCreate: MouseEventHandler<HTMLButtonElement>;
  setNewLocation: any;
  setNewCities: any;
  setOpenDialog: any;
}

function LocationInputDialog({
  title,
  newLocation,
  newCities,
  openDialog,
  showValidationErrorMessage,
  isCreating,
  setOpenDialog,
  setNewLocation,
  setNewCities,
  onCreate,
}: LocationInputDialogProps) {
  const [states] = useState(
    City.getCitiesOfCountry('LK')
      ?.map((state) => ({ label: state.name, value: state.name })),
  );

  const handleCitiesChange = (event: ChangeEvent<{ value: unknown }>) => {
    const val = event.target.value as string[];
    const toSet = val.map((v) => ({
      countryId: newLocation.id,
      countryName: newLocation.value,
      label: v,
      value: v,
    }));

    setNewCities(toSet);
  };

  const onCountryChange = (val: string) => {
    const countryCode = 'LK';
    setNewLocation({ id: countryCode, label: val, value: val });
    setNewCities([]);
  };

  return (
    <>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle style={settingsStyles.title}>{title}</DialogTitle>
        <DialogContent style={settingsStyles.multiFieldDialogContainer}>
          {states && (
            <>
              <FormControl>
                <InputLabel>Location</InputLabel>
                <InputAtom
                  placeholder="Location"
                  value={newLocation.value}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => onCountryChange(e.target.value)}
                  fullWidth
                />
              </FormControl>

              <Select
                labelId="cities-label"
                id="cities"
                multiple
                placeholder="Cities"
                value={newCities.map((city) => city.value)}
                onChange={handleCitiesChange}
                input={<Input />}
                MenuProps={MenuProps}
              >
                {states.map((city) => (
                  <MenuItem key={uuid()} value={city.value}>
                    {city.label}
                  </MenuItem>
                ))}
              </Select>
            </>
          )}
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
            onClick={onCreate}
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

export default LocationInputDialog;
