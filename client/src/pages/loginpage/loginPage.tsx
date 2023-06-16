import { Fragment } from 'react';
import LoginForm from '../../components/loginForm/loginForm';
import React from 'react';
import './LoginPage.css';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface loginPageProps {}

const LoginPage: React.FC<loginPageProps> = () => {
  return (
    <Fragment>
      <LoginForm />
    </Fragment>
  );
};

export default LoginPage;
