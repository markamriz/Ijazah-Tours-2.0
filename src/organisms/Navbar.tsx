import DivAtom from '../atoms/DivAtom';
import LinkAtom from '../atoms/LinkAtom';
import LinkTextAtom from '../atoms/LinkTextAtom';
import { navbarStyles } from '../styles';
import { NavbarType } from '../utils/types';

const LINKS = [
  {
    type: 'dashboard',
    links: [
      { key: '1', text: 'Quotations', link: '/dashboard/quotations' },
      { key: '2', text: 'Guest', link: '/dashboard/guest' },
      { key: '3', text: 'Voucher', link: '/dashboard/voucher' },
    ],
  },
  {
    type: 'quote',
    links: [
      { key: '1', text: 'Quotations', link: '/quote/quotations' },
      { key: '2', text: 'Voucher', link: '/quote/voucher' },
      { key: '3', text: 'Summary', link: '/quote/summary/:id' },
    ],
  },
  {
    type: 'library',
    links: [
      { key: '1', text: 'Accomodation', link: '/library/accomodation' },
      { key: '2', text: 'Driver', link: '/library/driver' },
      { key: '3', text: 'Guest', link: '/library/guest' },
    ],
  },
  {
    type: 'settings',
    links: [
      { key: '1', text: 'User Management', link: '/settings/user-management' },
      { key: '2', text: 'Tour', link: '/settings/tour' },
      { key: '3', text: 'Accomodation', link: '/settings/accomodation' },
      { key: '4', text: 'General', link: '/settings/general' },
    ],
  },
];

interface NavbarProps {
  type: NavbarType;
}

function Navbar({ type }: NavbarProps) {
  const navbarType = LINKS.find((obj) => obj.type === type);

  return (
    <DivAtom style={navbarStyles.container}>
      {navbarType?.links.map((link) => (
        <LinkAtom
          disabled={link.link === '/quote/summary'}
          style={{ ...navbarStyles.link, cursor: link.link === '/quote/summary' ? 'default' : 'pointer' }}
          key={link.key}
          to={link.link}
        >
          <LinkTextAtom text={link.text} />
        </LinkAtom>
      ))}
    </DivAtom>
  );
}

export default Navbar;
