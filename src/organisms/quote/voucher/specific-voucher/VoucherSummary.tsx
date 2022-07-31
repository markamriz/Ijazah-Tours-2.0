import DivAtom from '../../../../atoms/DivAtom';
import SpanAtom from '../../../../atoms/SpanAtom';
import { voucherStyles } from '../../../../styles';

interface VoucherSummaryProps {
  type: string;
  vData: any;
}

function VoucherSummary({ type, vData }: VoucherSummaryProps) {
  const getFieldA = () => {
    let text = 'Ref Num';
    let data = vData.guestDetails.refNum;
    if (type === 'driver') {
      text = 'Driver Name';
      data = vData.driverDetails.name;
    } else if (type === 'accomodation') {
      text = 'Accomodation Name';
      data = vData.accomodationDetails.name;
    }

    return [text, data];
  };

  const getFieldB = () => {
    let text = 'Guest Name';
    let data = vData.guestDetails.name;
    if (type === 'driver') {
      text = 'Address';
      data = vData.driverDetails.address;
    } else if (type === 'accomodation') {
      text = 'Address';
      data = `${vData.accomodationDetails.city} | ${vData.accomodationDetails.country}`;
    }

    return [text, data];
  };

  const getArrival = () => {
    let data = vData.guestDetails.arrival;
    if (type === 'accomodation') {
      data = vData.accomodationDetails.checkin;
    }

    return data;
  };

  const getDeparture = () => {
    let data = vData.guestDetails.arrival;
    if (type === 'accomodation') {
      data = vData.accomodationDetails.checkout;
    }

    return data;
  };

  const DITCContainer = () => (
    <DivAtom style={voucherStyles.voucherTemplate.summaryDetails.mainContainer}>
      <DivAtom>
        <p style={voucherStyles.voucherTemplate.summaryDetails.detailContainer}>
          <SpanAtom
            text={getFieldA()[0]}
            style={voucherStyles.voucherTemplate.summaryDetails.label}
          />
          <SpanAtom
            text={getFieldA()[1]}
            style={voucherStyles.voucherTemplate.summaryDetails.detail}
          />
        </p>
        {(type !== 'driver' && type !== 'accomodation') && (
          <p style={voucherStyles.voucherTemplate.summaryDetails.detailContainer}>
            <SpanAtom
              text="Country"
              style={voucherStyles.voucherTemplate.summaryDetails.label}
            />
            <SpanAtom
              text={vData.guestDetails.nationality}
              style={voucherStyles.voucherTemplate.summaryDetails.detail}
            />
          </p>
        )}
        <p style={voucherStyles.voucherTemplate.summaryDetails.detailContainer}>
          <SpanAtom
            text={getFieldB()[0]}
            style={voucherStyles.voucherTemplate.summaryDetails.label}
          />
          <SpanAtom
            text={getFieldB()[1]}
            style={voucherStyles.voucherTemplate.summaryDetails.detail}
          />
        </p>
      </DivAtom>

      <DivAtom>
        <>
          <p style={voucherStyles.voucherTemplate.summaryDetails.detailContainer}>
            <SpanAtom
              text="Arrival"
              style={voucherStyles.voucherTemplate.summaryDetails.label}
            />
            <SpanAtom
              text={getArrival()}
              style={voucherStyles.voucherTemplate.summaryDetails.detail}
            />
          </p>
          <p style={voucherStyles.voucherTemplate.summaryDetails.detailContainer}>
            <SpanAtom
              text="Departure"
              style={voucherStyles.voucherTemplate.summaryDetails.label}
            />
            <SpanAtom
              text={getDeparture()}
              style={voucherStyles.voucherTemplate.summaryDetails.detail}
            />
          </p>
          {type === 'driver' && (
            <p style={voucherStyles.voucherTemplate.summaryDetails.detailContainer}>
              <SpanAtom
                text="Days"
                style={voucherStyles.voucherTemplate.summaryDetails.label}
              />
              <SpanAtom
                text={vData.guestDetails.daysAndNights.split('-')[0]}
                style={voucherStyles.voucherTemplate.summaryDetails.detail}
              />
            </p>
          )}
        </>
      </DivAtom>
    </DivAtom>
  );

  return (
    <DITCContainer />
  );
}

export default VoucherSummary;
