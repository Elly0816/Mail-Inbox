import { useContext, Fragment, useEffect, useState, useMemo } from 'react';
import SignUpForm from '../../components/signupForm/signupForm';
import React from 'react';
import './signupPage.css';
import { authContext } from '../../App';
import { useNavigate } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface loginPageProps {}

const SignUpPage: React.FC<loginPageProps> = () => {
  const navigate = useNavigate();
  const { auth, user } = useContext(authContext);
  useEffect(
    () => {
      if (user && auth) {
        navigate('/');
      }
    }
    //    [auth, navigate, user]
  );
  const [loading, setLoading] = useState<boolean>(false);

  const child = useMemo(() => {
    return loading ? (
      <div>Loading...</div>
    ) : (
      <Fragment>
        <SignUpForm loading={loading} setLoading={setLoading} />
        <button
          onClick={() => {
            navigate('/login');
          }}
        >
          Click me to Login
        </button>
      </Fragment>
    );
  }, [loading]);
  return <Fragment>{child}</Fragment>;
};

export default SignUpPage;
