import CheckboxAtom from '../../../../../atoms/CheckboxAtom';
import DivAtom from '../../../../../atoms/DivAtom';
import ParagraphAtom from '../../../../../atoms/ParagraphAtom';
import { approvalStyles } from '../../../../../styles';

interface OffersProps {
  roomAndBreakfast: boolean;
  receptionAtAirport: boolean;
  allGovernmentTaxes: boolean;
  guideAndCar: boolean;
  setRoomAndBreakfast: any;
  setReceptionAtAirport: any;
  setAllGovernmentTaxes: any;
  setGuideAndCar: any;
}

function Offers({
  roomAndBreakfast,
  receptionAtAirport,
  allGovernmentTaxes,
  guideAndCar,
  setRoomAndBreakfast,
  setReceptionAtAirport,
  setAllGovernmentTaxes,
  setGuideAndCar,
}: OffersProps) {
  return (
    <DivAtom style={approvalStyles.offers.container}>
      <ParagraphAtom style={approvalStyles.titleText} text="This offer includes:" />
      <CheckboxAtom
        checked={roomAndBreakfast}
        onChange={() => setRoomAndBreakfast(!roomAndBreakfast)}
        label="Room and Breakfast in the hotel"
        name="room-and-breakfast"
      />
      <CheckboxAtom
        checked={receptionAtAirport}
        onChange={() => setReceptionAtAirport(!receptionAtAirport)}
        label="Reception at Airport"
        name="reception-at-airport"
      />
      <CheckboxAtom
        checked={allGovernmentTaxes}
        onChange={() => setAllGovernmentTaxes(!allGovernmentTaxes)}
        label="All Government Taxes"
        name="all-government-taxes"
      />
      <CheckboxAtom
        checked={guideAndCar}
        onChange={() => setGuideAndCar(!guideAndCar)}
        label="Guide and the Car. Transportation from Reception to Fairwell, (Throught the Trip)"
        name="guide-and-the-car"
      />
    </DivAtom>
  );
}

export default Offers;
