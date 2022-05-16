import { v4 as uuid } from 'uuid';

import DivAtom from '../../../../../atoms/DivAtom';
import SpanAtom from '../../../../../atoms/SpanAtom';
import { approvalStyles } from '../../../../../styles';

interface GuestDetailsProps {
  name: string;
  nationality: string;
  adults: string;
  quoteNo: string;
  arrival: string;
  departure: string;
  daysAndNights: string;
  children: string[];
}

function GuestDetails({
  name,
  nationality,
  adults,
  quoteNo,
  arrival,
  departure,
  daysAndNights,
  children,
}: GuestDetailsProps) {
  const getChildrenAgeString = (age: string, index: number) => (index === children.length - 1 ? age : `${age}, `);

  return (
    <DivAtom style={approvalStyles.guestDetails.container}>
      <DivAtom>
        <p style={approvalStyles.guestDetails.costContainer.container}>
          <SpanAtom
            style={approvalStyles.guestDetails.costContainer.label}
            text="Guest"
          />
          <SpanAtom
            style={approvalStyles.guestDetails.costContainer.cost}
            text={name}
          />
        </p>
        <p style={approvalStyles.guestDetails.costContainer.container}>
          <SpanAtom
            style={approvalStyles.guestDetails.costContainer.label}
            text="Nationality"
          />
          <SpanAtom
            style={approvalStyles.guestDetails.costContainer.cost}
            text={nationality}
          />
        </p>
        <p style={approvalStyles.guestDetails.costContainer.container}>
          <SpanAtom
            style={approvalStyles.guestDetails.costContainer.label}
            text="Adults"
          />
          <SpanAtom
            style={approvalStyles.guestDetails.costContainer.cost}
            text={adults}
          />
        </p>
        {children && (
          <p style={approvalStyles.guestDetails.costContainer.container}>
            <SpanAtom
              style={approvalStyles.guestDetails.costContainer.label}
              text="Children Ages"
            />
            <span>
              {children.map((child, index) => (
                <SpanAtom
                  key={uuid()}
                  style={approvalStyles.guestDetails.costContainer.cost}
                  text={getChildrenAgeString(child, index)}
                />
              ))}
            </span>
          </p>
        )}
      </DivAtom>
      <DivAtom>
        <p style={approvalStyles.guestDetails.costContainer.container}>
          <SpanAtom
            style={approvalStyles.guestDetails.costContainer.label}
            text="Quote Id"
          />
          <SpanAtom
            style={approvalStyles.guestDetails.costContainer.cost}
            text={quoteNo}
          />
        </p>
        <p style={approvalStyles.guestDetails.costContainer.container}>
          <SpanAtom
            style={approvalStyles.guestDetails.costContainer.label}
            text="Arrival"
          />
          <SpanAtom
            style={approvalStyles.guestDetails.costContainer.cost}
            text={arrival}
          />
        </p>
        <p style={approvalStyles.guestDetails.costContainer.container}>
          <SpanAtom
            style={approvalStyles.guestDetails.costContainer.label}
            text="Departure"
          />
          <SpanAtom
            style={approvalStyles.guestDetails.costContainer.cost}
            text={departure}
          />
        </p>
        <p style={approvalStyles.guestDetails.costContainer.container}>
          <SpanAtom
            style={approvalStyles.guestDetails.costContainer.label}
            text="Days & Nights"
          />
          <SpanAtom
            style={approvalStyles.guestDetails.costContainer.cost}
            text={daysAndNights}
          />
        </p>
      </DivAtom>
    </DivAtom>
  );
}

export default GuestDetails;
