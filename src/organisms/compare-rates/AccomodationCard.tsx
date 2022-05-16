import { Paper } from '@material-ui/core';
import styled from 'styled-components';

import ParagraphAtom from '../../atoms/ParagraphAtom';
import SpanAtom from '../../atoms/SpanAtom';
import { quoteCreateQuoteStyles } from '../../styles';
import { CompareRatesAccomdation } from '../../utils/types';

interface AccomodationCardProps {
  accomodation: CompareRatesAccomdation;
}

function AccomodationCard({ accomodation }: AccomodationCardProps) {
  return (
    <StyledPaper elevation={1}>
      <p style={quoteCreateQuoteStyles.searchBar.accomodationContainer.card.titleContainer}>
        <SpanAtom
          text={accomodation.name}
          style={quoteCreateQuoteStyles.searchBar.accomodationContainer.card.label}
        />
        {accomodation.accGradings.length > 0 && (
          <span style={{ margin: 0 }}>
            <SpanAtom
              text="Gradings: "
              style={quoteCreateQuoteStyles.searchBar.accomodationContainer.card.label}
            />
            <SpanAtom text={accomodation.accGradings.join(', ')} />
          </span>
        )}
      </p>
      <ParagraphAtom
        text={`${accomodation.country}, ${accomodation.city}`}
        style={quoteCreateQuoteStyles.searchBar.accomodationContainer.card.location}
      />
      <ParagraphAtom
        text={accomodation.bookingEngine}
        style={quoteCreateQuoteStyles.searchBar.accomodationContainer.card.bookingEngine}
      />
      <p style={quoteCreateQuoteStyles.searchBar.accomodationContainer.card.costContainer}>
        {accomodation.roomTypes.length > 0 && (
          <span style={{ margin: 0, width: '600px' }}>
            <SpanAtom
              text="Room Types: "
              style={quoteCreateQuoteStyles.searchBar.accomodationContainer.card.label}
            />
            <SpanAtom text={accomodation.roomTypes.join(', ')} />
          </span>
        )}
        <span style={{ margin: 0 }}>
          <SpanAtom
            text="Total Cost: "
            style={quoteCreateQuoteStyles.searchBar.accomodationContainer.card.label}
          />
          <SpanAtom text={accomodation.total} />
        </span>
      </p>
    </StyledPaper>
  );
}

export default AccomodationCard;

const StyledPaper = styled(Paper)`
  padding: 1rem;
  margin: 1rem;
  width:46%;
`;
