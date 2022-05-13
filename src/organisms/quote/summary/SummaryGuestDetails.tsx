import DivAtom from '../../../atoms/DivAtom';
import SpanAtom from '../../../atoms/SpanAtom';
import { summaryStyles } from '../../../styles';

interface SummaryGuestDetailsProps {
  quotation: any;
  vouchers: any[];
}

function SummaryGuestDetails({
  quotation,
  vouchers,
}: SummaryGuestDetailsProps) {
  return (
    <DivAtom style={summaryStyles.voucherTemplate.summaryDetails.mainContainer}>
      <DivAtom>
        <p style={summaryStyles.voucherTemplate.summaryDetails.detailContainer}>
          <SpanAtom
            text="Guest"
            style={summaryStyles.voucherTemplate.summaryDetails.label}
          />
          <SpanAtom
            text={quotation.name}
            style={summaryStyles.voucherTemplate.summaryDetails.detail}
          />
        </p>
        <p style={summaryStyles.voucherTemplate.summaryDetails.detailContainer}>
          <SpanAtom
            text="Nationality"
            style={summaryStyles.voucherTemplate.summaryDetails.label}
          />
          <SpanAtom
            text={quotation.nationality}
            style={summaryStyles.voucherTemplate.summaryDetails.detail}
          />
        </p>
        <p style={summaryStyles.voucherTemplate.summaryDetails.detailContainer}>
          <SpanAtom
            text="Reference No"
            style={summaryStyles.voucherTemplate.summaryDetails.label}
          />
          <SpanAtom
            text={quotation.refNum}
            style={summaryStyles.voucherTemplate.summaryDetails.detail}
          />
        </p>
        <p style={summaryStyles.voucherTemplate.summaryDetails.detailContainer}>
          <SpanAtom
            text="Adults"
            style={summaryStyles.voucherTemplate.summaryDetails.label}
          />
          <SpanAtom
            text={quotation.adults}
            style={summaryStyles.voucherTemplate.summaryDetails.detail}
          />
        </p>
        <p style={summaryStyles.voucherTemplate.summaryDetails.detailContainer}>
          <SpanAtom
            text="Children"
            style={summaryStyles.voucherTemplate.summaryDetails.label}
          />
          <SpanAtom
            text={quotation.children.join(', ')}
            style={summaryStyles.voucherTemplate.summaryDetails.detail}
          />
        </p>
      </DivAtom>
      <DivAtom>
        <p style={summaryStyles.voucherTemplate.summaryDetails.detailContainer}>
          <SpanAtom
            text="Driver"
            style={summaryStyles.voucherTemplate.summaryDetails.label}
          />
          <SpanAtom
            text={vouchers[0].driverDetails.name}
            style={summaryStyles.voucherTemplate.summaryDetails.detail}
          />
        </p>
        <p style={summaryStyles.voucherTemplate.summaryDetails.detailContainer}>
          <SpanAtom
            text="Arrival"
            style={summaryStyles.voucherTemplate.summaryDetails.label}
          />
          <SpanAtom
            text={quotation.arrival}
            style={summaryStyles.voucherTemplate.summaryDetails.detail}
          />
        </p>
        <p style={summaryStyles.voucherTemplate.summaryDetails.detailContainer}>
          <SpanAtom
            text="Departure"
            style={summaryStyles.voucherTemplate.summaryDetails.label}
          />
          <SpanAtom
            text={quotation.departure}
            style={summaryStyles.voucherTemplate.summaryDetails.detail}
          />
        </p>
        <p style={summaryStyles.voucherTemplate.summaryDetails.detailContainer}>
          <SpanAtom
            text="Days & Nights"
            style={summaryStyles.voucherTemplate.summaryDetails.label}
          />
          <SpanAtom
            text={quotation.daysAndNights}
            style={summaryStyles.voucherTemplate.summaryDetails.detail}
          />
        </p>
      </DivAtom>
    </DivAtom>
  );
}

export default SummaryGuestDetails;
