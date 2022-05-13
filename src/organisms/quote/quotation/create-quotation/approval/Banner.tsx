import AnchorAtom from '../../../../../atoms/AnchorAtom';
import DivAtom from '../../../../../atoms/DivAtom';
import H2Atom from '../../../../../atoms/H2Atom';
import ParagraphAtom from '../../../../../atoms/ParagraphAtom';
import { approvalStyles } from '../../../../../styles';

function Banner() {
  return (
    <DivAtom style={approvalStyles.banner.mainContainer}>
      <img src={require('../../../../../assets/logo-full.png')} alt="logo" />
      <DivAtom style={approvalStyles.banner.contentContainer}>
        <DivAtom>
          <H2Atom
            style={approvalStyles.banner.text}
            text="Ijazah Tours (Pvt) Ltd"
          />
          <ParagraphAtom
            style={approvalStyles.banner.text}
            text="Government Approved Tour Company"
          />
          <ParagraphAtom
            style={approvalStyles.banner.text}
            text="115, Manning Place, Colombo 06, Sri Lanka"
          />
        </DivAtom>
        <DivAtom>
          <ParagraphAtom
            style={approvalStyles.banner.text}
            text="+(94) 777 447 515"
          />
          <DivAtom style={approvalStyles.banner.social}>
            <AnchorAtom
              style={{ ...approvalStyles.banner.text, margin: '0 0.8rem 0 0' }}
              title="info@ijazahtours.com"
              href="mailto:info@ijazahtours.com"
            />
            <AnchorAtom
              style={approvalStyles.banner.text}
              title="www.ijazahtours.com"
              href="https://www.ijazahtours.com"
            />
          </DivAtom>
        </DivAtom>
      </DivAtom>
    </DivAtom>
  );
}

export default Banner;
