import CheckboxAtom from '../../../../../../atoms/CheckboxAtom';
import DivAtom from '../../../../../../atoms/DivAtom';
import ParagraphAtom from '../../../../../../atoms/ParagraphAtom';
import { quoteCreateQuoteStyles } from '../../../../../../styles';
import { SettingsSingleInput } from '../../../../../../utils/types';

type Checked = {
  value: string;
  type: string | undefined;
  checked: boolean;
};

interface SidebarProps {
  accomodationTypesData: SettingsSingleInput[];
  roomTypesData: SettingsSingleInput[];
  roomViewsData: SettingsSingleInput[];
  roomGradingsData: SettingsSingleInput[];
  checked: Checked[];
  onCheckboxChange: (index: number) => void;
}

function Sidebar({
  accomodationTypesData,
  roomTypesData,
  roomViewsData,
  roomGradingsData,
  checked,
  onCheckboxChange,
}: SidebarProps) {
  return (
    <DivAtom style={quoteCreateQuoteStyles.searchBar.sidebarContainer}>
      <DivAtom>
        <ParagraphAtom
          style={{ ...quoteCreateQuoteStyles.searchBar.checkboxSectionContainer.title, margin: 0 }}
          text="Filter By"
        />
        <hr />
        <ParagraphAtom
          text="Accomodations"
          style={quoteCreateQuoteStyles.searchBar.checkboxSectionContainer.title}
        />
        <DivAtom style={quoteCreateQuoteStyles.searchBar.checkboxSectionContainer.container}>
          {accomodationTypesData.map((type, index) => (
            <CheckboxAtom
              key={index}
              checked={checked[index].checked}
              onChange={() => onCheckboxChange(index)}
              label={type.val}
              name={type.val}
            />
          ))}
        </DivAtom>
        <hr />
        <ParagraphAtom
          text="Room Types"
          style={quoteCreateQuoteStyles.searchBar.checkboxSectionContainer.title}
        />
        <DivAtom style={quoteCreateQuoteStyles.searchBar.checkboxSectionContainer.container}>
          {roomTypesData.map((type, index) => (
            <CheckboxAtom
              key={index}
              checked={checked[index + accomodationTypesData.length].checked}
              onChange={() => onCheckboxChange(index + accomodationTypesData.length)}
              label={type.val}
              name={type.val}
            />
          ))}
        </DivAtom>
        <hr />
        <ParagraphAtom
          text="Room Views"
          style={quoteCreateQuoteStyles.searchBar.checkboxSectionContainer.title}
        />
        <DivAtom style={quoteCreateQuoteStyles.searchBar.checkboxSectionContainer.container}>
          {roomViewsData.map((type, index) => (
            <CheckboxAtom
              key={index}
              checked={checked[index + accomodationTypesData.length + roomTypesData.length].checked}
              onChange={() => (
                onCheckboxChange(index + accomodationTypesData.length + roomTypesData.length)
              )}
              label={type.val}
              name={type.val}
            />
          ))}
        </DivAtom>
        <hr />
        <ParagraphAtom
          text="Gradings"
          style={quoteCreateQuoteStyles.searchBar.checkboxSectionContainer.title}
        />
        <DivAtom style={quoteCreateQuoteStyles.searchBar.checkboxSectionContainer.container}>
          {roomGradingsData.map((type, index) => (
            <CheckboxAtom
              key={index}
              checked={checked[
                index
                + accomodationTypesData.length
                + roomTypesData.length
                + roomViewsData.length
              ].checked}
              onChange={() => (
                onCheckboxChange(
                  index
                  + accomodationTypesData.length
                  + roomTypesData.length
                  + roomViewsData.length,
                )
              )}
              label={type.val}
              name={type.val}
            />
          ))}
        </DivAtom>
      </DivAtom>
    </DivAtom>
  );
}

export default Sidebar;
