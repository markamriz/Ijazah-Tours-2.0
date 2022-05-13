import {
  FormEvent,
  useState,
} from 'react';

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import DivAtom from '../../atoms/DivAtom';
import H2Atom from '../../atoms/H2Atom';
import ParagraphAtom from '../../atoms/ParagraphAtom';
import LoginForm from '../../organisms/login/LoginForm';
import { selectWithNavbarWidth } from '../../redux/containerSizeSlice';
import { login } from '../../redux/userSlice';
import { loginStyles } from '../../styles';
import { getUserOnLogin, widthHeightDynamicStyle } from '../../utils/helpers';

function Login() {
  const width = useSelector(selectWithNavbarWidth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [invalidLoginMessage, setInvalidLoginMessage] = useState('');

  const history = useHistory();

  const dispatch = useDispatch();

  const onLogin = async (e: FormEvent<HTMLFormElement>) => {
    localStorage.setItem('Ijazah Remember Me', String(rememberMe));

    e.preventDefault();
    setInvalidLoginMessage('');
    const auth = getAuth();
    setIsLoggingIn(true);

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const userData = await getUserOnLogin(user);
      dispatch(login(userData));
      history.replace('/dashboard');
    } catch (err) {
      setInvalidLoginMessage('Invalid Credentials');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <DivAtom style={loginStyles.wrapper}>
      <DivAtom
        style={{
          ...loginStyles.formContainer,
          width: widthHeightDynamicStyle(width, 1000, '80%%', '25%'),
          height: 'auto',
        }}
      >
        <H2Atom
          text="Welcome Back"
          style={loginStyles.title}
        />
        <ParagraphAtom
          text="Login to your account"
          style={loginStyles.subtitle}
        />

        <LoginForm
          width={width}
          email={email}
          password={password}
          invalidLoginMessage={invalidLoginMessage}
          rememberMe={rememberMe}
          isLoggingIn={isLoggingIn}
          onLogin={onLogin}
          setEmail={setEmail}
          setPassword={setPassword}
          setRememberMe={setRememberMe}
        />
      </DivAtom>
    </DivAtom>
  );
}

export default Login;
