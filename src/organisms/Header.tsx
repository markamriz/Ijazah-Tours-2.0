import { MouseEvent, useState } from 'react';

import {
  createStyles,
  Hidden,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Theme,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MenuIcon from '@material-ui/icons/Menu';
import { getAuth, signOut } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import AvatarAtom from '../atoms/AvatarAtom';
import DivAtom from '../atoms/DivAtom';
import SpanAtom from '../atoms/SpanAtom';
import GuestProfile from '../molecules/GuestProfile';
import { logout, selectUser } from '../redux/userSlice';
import { headerStyles } from '../styles';

const useStyles = makeStyles((theme: Theme) => createStyles({
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('lg')]: {
      display: 'none',
    },
  },
}));

interface HeaderProps {
  handleDrawerToggle: () => void;
}

function Header({ handleDrawerToggle }: HeaderProps) {
  const user = useSelector(selectUser);

  const [openProfileMenu, setOpenProfileMenu] = useState<null | HTMLElement>(null);

  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();

  const handleClickProfileMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setOpenProfileMenu(event.currentTarget);
  };

  const onLogout = async () => {
    await signOut(getAuth());
    dispatch(logout());
    handleCloseProfileMenu();
  };

  const navigateToProfile = () => {
    history.replace('/user-profile');
    handleCloseProfileMenu();
  };

  const handleCloseProfileMenu = () => {
    setOpenProfileMenu(null);
  };

  return (
    <DivAtom style={headerStyles.container}>
      <DivAtom style={headerStyles.logoContainer}>
        <AvatarAtom
          style={headerStyles.avatar}
          alt="Logo"
          image={require('../assets/logo.png')}
        />
        <Hidden xsDown>
          <SpanAtom style={headerStyles.spanI} text="Ijazah" />
          <SpanAtom style={headerStyles.spanT} text="Tours" />
        </Hidden>
        <Hidden mdDown>
          <DivAtom style={headerStyles.userProfile}>
            <GuestProfile
              titleWeight={900}
              title={user.firstName}
              image={user.profileImg || require('../assets/default-user.png')}
              paraColor="white"
            />
            <IconButton
              style={{ color: 'white' }}
              onClick={handleClickProfileMenu}
              size="small"
              aria-controls="profile-menu"
              aria-haspopup="true"
            >
              <ExpandMoreIcon />
            </IconButton>
            <Menu
              id="profile-menu"
              anchorEl={openProfileMenu}
              keepMounted
              open={Boolean(openProfileMenu)}
              onClose={handleCloseProfileMenu}
            >
              <MenuItem onClick={navigateToProfile}>View Profile</MenuItem>
              <MenuItem onClick={onLogout}>Logout</MenuItem>
            </Menu>
          </DivAtom>
        </Hidden>
      </DivAtom>
      <DivAtom>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
      </DivAtom>
    </DivAtom>
  );
}

export default Header;
