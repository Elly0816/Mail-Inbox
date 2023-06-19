import { useContext, Fragment, useEffect, useState, useMemo } from 'react';
import LoginForm from '../../components/loginForm/loginForm';
import React from 'react';
import './LoginPage.css';
import { authContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/loading/Loading';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface loginPageProps {}

const LoginPage: React.FC<loginPageProps> = () => {
  const navigate = useNavigate();
  const { auth, user } = useContext(authContext);
  useEffect(
    () => {
      if (user && auth) {
        navigate('/');
      }
    }
    //  [auth, navigate, user]
  );
  const [loading, setLoading] = useState<boolean>(false);

  return !loading ? (
    <Fragment>
      <LoginForm loading={loading} setLoading={setLoading} />
      <button
        onClick={() => {
          navigate('/signup');
        }}
      >
        Click me to Sign Up
      </button>
    </Fragment>
  ) : (
    <Loading />
  );
};

export default LoginPage;
