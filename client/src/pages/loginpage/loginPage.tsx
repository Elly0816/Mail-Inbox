import { useContext, Fragment, useEffect, useState, useMemo } from 'react';
import LoginForm from '../../components/loginForm/loginForm';
import React from 'react';
import './LoginPage.css';
import { authContext } from '../../App';
import { useNavigate } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface loginPageProps {}

const LoginPage: React.FC<loginPageProps> = () => {
  const navigate = useNavigate();
  const { auth, user } = useContext(authContext);
  useEffect(() => {
    if (user && auth) {
      navigate('/');
    }
  }, [auth, navigate, user]);
  const [loading, setLoading] = useState<boolean>(false);

  const child = useMemo(() => {
    return loading ? (
      <div>Loading...</div>
    ) : (
      <LoginForm loading={loading} setLoading={setLoading} />
    );
  }, [loading]);
  return <Fragment>{child}</Fragment>;
};

export default LoginPage;
