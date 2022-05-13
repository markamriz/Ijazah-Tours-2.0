import { Paper } from '@material-ui/core';
import styled from 'styled-components';

import ParagraphAtom from '../../../../../../atoms/ParagraphAtom';
import SpanAtom from '../../../../../../atoms/SpanAtom';
import { quoteCreateQuoteStyles } from '../../../../../../styles';
import { UserAccomodation } from '../../../../../../utils/types';

interface AccomodationCardProps {
  accomodation: UserAccomodation;
  addAccomodation: (acc: UserAccomodation) => void
}

function AccomodationCard({
  accomodation,
  addAccomodation,
}: AccomodationCardProps) {
  const getRoomTypes = () => {
    const fromValues = Object.keys(accomodation.categoryValues);
    const fromRates = accomodation.rates.map((r) => r.newRateType);
    return [...fromValues, ...fromRates].join(', ');
  };

  return (
    <StyledPaper elevation={1} onClick={() => addAccomodation(accomodation)}>
      <p style={quoteCreateQuoteStyles.searchBar.accomodationContainer.card.titleContainer}>
        <SpanAtom
          text={accomodation.name}
          style={quoteCreateQuoteStyles.searchBar.accomodationContainer.card.label}
        />
        <span style={{ margin: 0 }}>
          <SpanAtom
            text="Gradings: "
            style={quoteCreateQuoteStyles.searchBar.accomodationContainer.card.label}
          />
          <SpanAtom text={accomodation.gradings.filter((g) => g.checked).map((g) => g.val).join(', ')} />
        </span>
      </p>
      <ParagraphAtom
        text={`${accomodation.country}, ${accomodation.city}`}
        style={quoteCreateQuoteStyles.searchBar.accomodationContainer.card.location}
      />
      <p>
        <SpanAtom
          text="Room Types: "
          style={quoteCreateQuoteStyles.searchBar.accomodationContainer.card.label}
        />
        <SpanAtom text={getRoomTypes()} />
      </p>
    </StyledPaper>
  );
}

export default AccomodationCard;

const StyledPaper = styled(Paper)`
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: 0.6s ease;
  :hover {
    background-color: #eee;
  }
`;
