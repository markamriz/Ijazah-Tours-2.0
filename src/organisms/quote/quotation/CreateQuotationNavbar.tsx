import DivAtom from '../../../atoms/DivAtom';
import LinkAtom from '../../../atoms/LinkAtom';
import LinkTextAtom from '../../../atoms/LinkTextAtom';
import { navbarStyles } from '../../../styles';

const LINKS = [
  { key: '1', text: 'Customer', link: '/quote/quotations/create/customer' },
  {
    key: '2',
    text: 'Accomodation',
    link: '/quote/quotations/create/accomodation',
  },
  { key: '3', text: 'Costing', link: '/quote/quotations/create/costing' },
  { key: '4', text: 'Approval', link: '/quote/quotations/create/approval' },
];

function CreateQuotationNavbar() {
  return (
    <DivAtom style={navbarStyles.container}>
      {LINKS.map((link) => (
        <LinkAtom
          disabled
          style={{ ...navbarStyles.link, cursor: 'default' }}
          key={link.key}
          to={link.link}
        >
          <LinkTextAtom text={link.text} />
        </LinkAtom>
      ))}
    </DivAtom>
  );
}

export default CreateQuotationNavbar;
