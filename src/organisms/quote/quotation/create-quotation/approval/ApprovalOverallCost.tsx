import DivAtom from '../../../../../atoms/DivAtom';
import SpanAtom from '../../../../../atoms/SpanAtom';
import { approvalStyles } from '../../../../../styles';

interface ApprovalOverallCostProps {
  sellingPrice: string;
  discount: string;
  netPrice: string;
}

function ApprovalOverallCost({
  sellingPrice,
  discount,
  netPrice,
}: ApprovalOverallCostProps) {
  return (
    <DivAtom style={approvalStyles.overallCost.container}>
      <p style={approvalStyles.overallCost.costContainer.container}>
        <SpanAtom
          style={approvalStyles.overallCost.costContainer.label}
          text="Selling Price"
        />
        <SpanAtom
          style={approvalStyles.overallCost.costContainer.cost}
          text={sellingPrice}
        />
      </p>
      <p style={approvalStyles.overallCost.costContainer.container}>
        <SpanAtom
          style={approvalStyles.overallCost.costContainer.label}
          text="Discount"
        />
        <SpanAtom
          style={approvalStyles.overallCost.costContainer.cost}
          text={discount}
        />
      </p>
      <p style={approvalStyles.overallCost.costContainer.netPriceContainer}>
        <SpanAtom
          style={approvalStyles.overallCost.costContainer.label}
          text="Net Price"
        />
        <SpanAtom
          style={approvalStyles.overallCost.costContainer.cost}
          text={netPrice}
        />
      </p>
    </DivAtom>
  );
}

export default ApprovalOverallCost;
