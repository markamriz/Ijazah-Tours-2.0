import { ChangeEvent, FormEvent } from 'react';

import { CircularProgress } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import MailOutlineIcon from '@material-ui/icons/MailOutline';

import ButtonAtom from '../../atoms/ButtonAtom';
import CheckboxAtom from '../../atoms/CheckboxAtom';
import InputAtom from '../../atoms/InputAtom';
import ParagraphAtom from '../../atoms/ParagraphAtom';
import { loginStyles } from '../../styles';

interface LoginFormProps {
  width: number;
  email: string;
  password: string;
  invalidLoginMessage: string;
  rememberMe: boolean;
  isLoggingIn: boolean;
  onLogin: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  setEmail: any;
  setPassword: any;
  setRememberMe: any;
}

function LoginForm({
  width,
  email,
  password,
  invalidLoginMessage,
  rememberMe,
  isLoggingIn,
  onLogin,
  setEmail,
  setPassword,
  setRememberMe,
}: LoginFormProps) {
  return (
    <form onSubmit={(e) => onLogin(e)} style={loginStyles.form}>
      <InputAtom
        placeholder="Email"
        adornmentPosition="start"
        type="email"
        fullWidth={width < 768}
        value={email}
        plain="false"
        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        children={<MailOutlineIcon />}
        style={{ ...loginStyles.inputs, margin: '1rem 0' }}
      />
      <InputAtom
        placeholder="Password"
        adornmentPosition="start"
        type="password"
        fullWidth={width < 768}
        value={password}
        plain="false"
        onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        children={<LockOutlinedIcon />}
        style={{ ...loginStyles.inputs, marginBottom: '2rem' }}
      />
      <CheckboxAtom
        label="Remember Me"
        name="remember-me"
        checked={rememberMe}
        onChange={() => setRememberMe(!rememberMe)}
      />
      {invalidLoginMessage !== '' && (
        <ParagraphAtom style={loginStyles.errorMsg} text={invalidLoginMessage} />
      )}
      <ButtonAtom
        size="large"
        endIcon={isLoggingIn && <CircularProgress size={20} color="inherit" />}
        disabled={isLoggingIn}
        style={loginStyles.loginBtn}
        type="submit"
        text="Sign In"
      />
    </form>
  );
}

export default LoginForm;
