import { useState } from 'react';

import DivAtom from '../../../../../../atoms/DivAtom';
import { quoteCreateQuoteStyles } from '../../../../../../styles';
import { SettingsSingleInput, UserAccomodation } from '../../../../../../utils/types';
import AccomodationCard from './AccomodationCard';
import Sidebar from './Sidebar';

interface SearchbarProps {
  searchTerm: string;
  accomodationData: UserAccomodation[];
  accomodationTypesData: SettingsSingleInput[];
  roomTypesData: SettingsSingleInput[];
  roomViewsData: SettingsSingleInput[];
  roomGradingsData: SettingsSingleInput[];
  addAccomodation: (acc: UserAccomodation) => void;
}

function Searchbar({
  searchTerm,
  accomodationData,
  accomodationTypesData,
  roomTypesData,
  roomViewsData,
  roomGradingsData,
  addAccomodation,
}: SearchbarProps) {
  const [checked, setChecked] = useState([
    ...accomodationTypesData,
    ...roomTypesData,
    ...roomViewsData,
    ...roomGradingsData].map((v) => ({ value: v.val, type: v.type, checked: false })));

  const onCheckboxChange = (index: number) => {
    const tempChecked = [...checked];
    tempChecked[index].checked = !checked[index].checked;
    setChecked(tempChecked);
  };

  const filterAccomodations = () => {
    let filteredAccomodations = accomodationData.filter((acc) => (
      acc.name.toLowerCase().includes(searchTerm.toLowerCase())
    ));

    if (checked.some((c) => c.checked === true)) {
      const currentlyChecked = checked.filter((c) => c.checked === true);
      currentlyChecked.forEach((c) => {
        switch (c.type) {
        case 'Accomodation Types': {
          const filtered = filteredAccomodations.filter((acc) => (
            acc.accomodationType === c.value
          ));

          filteredAccomodations = filtered;
          break;
        }
        case 'Room Types': {
          const filtered = filteredAccomodations.filter((acc) => (
            Object.keys(acc.categoryValues).includes(c.value)
            || acc.rates.find((r) => r.newRateType === c.value)
          ));

          filteredAccomodations = filtered;
          break;
        }
        case 'Room Views': {
          const filtered = filteredAccomodations.filter((acc) => (
            acc.views.find((v) => v.val === c.value && v.checked)
          ));

          filteredAccomodations = filtered;
          break;
        }
        case 'Gradings': {
          const filtered = filteredAccomodations.filter((acc) => (
            acc.gradings.find((v) => v.val === c.value && v.checked)
          ));

          filteredAccomodations = filtered;
          break;
        }
        default:
          break;
        }
      });
    }

    return filteredAccomodations;
  };

  return (
    <DivAtom style={quoteCreateQuoteStyles.searchBar.mainContainer}>
      <Sidebar
        accomodationTypesData={accomodationTypesData}
        roomTypesData={roomTypesData}
        roomViewsData={roomViewsData}
        roomGradingsData={roomGradingsData}
        checked={checked}
        onCheckboxChange={onCheckboxChange}
      />
      <DivAtom style={quoteCreateQuoteStyles.searchBar.accomodationContainer.container}>
        {filterAccomodations().map((acc, index) => (
          <AccomodationCard
            key={index}
            accomodation={acc}
            addAccomodation={addAccomodation}
          />
        ))}
      </DivAtom>
    </DivAtom>
  );
}

export default Searchbar;
