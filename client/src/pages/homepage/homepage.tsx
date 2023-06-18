import { useNavigate } from 'react-router-dom';
import './homepage.css';
import React, {
  Fragment,
  ReactElement,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import useFetch from '../../hooks/useFetch';
import Loading from '../../components/loading/Loading';
import { authContext } from '../../App';
import { queryServer } from '../../utils/types/helper/helper';
import useLocalStorage from '../../hooks/useLocalStorage';
import InboxPage from '../inboxpage/inboxPage';
import { getNameFromUser } from '../../utils/types/helper/helper';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface homePageProp {}

const HomePage: React.FC<homePageProp> = () => {
  //   const [threads, setThread] = useThread();

  const { auth, user, setAuth, setUser } = useContext(authContext);
  const navigate = useNavigate();
  const { data, error, loading } = useFetch({
    path: '',
    method: 'get',
    // next: '',
  });
  const [access, setAccess] = useLocalStorage({ name: 'access' });
  const [refresh, setRefresh] = useLocalStorage({ name: 'refresh' });

  const child = useMemo(() => {
    return (access && refresh) || data?.user ? (
      <div>
        <h3>{`Hi ${getNameFromUser(user?.email as string)}`}</h3>
        {
          data && <InboxPage />
          // Object.entries(data).map((value, index) => (
          //   <Fragment>
          //     <h3 key={index}>{`${
          //       (value[0] as string, value[1] as string)
          //     }`}</h3>
          //     <span>{user?.email.split('@')[0]}</span>
          //   </Fragment>
          // ))
        }
        <button
          onClick={() => {
            queryServer({
              method: 'post',
              url: '/logout',
              formdata: undefined,
            })
              .then((res) => {
                console.log(res);
                setAuth && setAuth(false);
                setUser && setUser(undefined);
                setAccess('undefined');
                setRefresh('undefined');
              })
              .catch((err) => {
                console.log(err);
              })
              .finally(() => {
                navigate('/login');
              });
          }}
        >
          logout
        </button>
      </div>
    ) : loading ? (
      <Loading />
    ) : (
      error && (
        <div>
          <h2>{error?.message}</h2>
        </div>
      )
    );
  }, [auth, user, loading, data, error]);

  useEffect(() => {
    error &&
      error.message.toLowerCase().includes('unauthorized') &&
      console.log('error, going to login');
    console.log(error);
    error &&
      error.message.toLowerCase().includes('unauthorized') &&
      navigate('/login');
  }, [error, navigate]);

  useEffect(() => {
    if (data?.user) {
      setUser && setUser(data?.user);
      setAuth && setAuth(true);
    }
    // else {
    //   // setUser && setUser(undefined);
    //   // setAuth && setAuth(false);
    //   // navigate('/login');
    // }
  }, [data]);

  return (
    <Fragment>
      {child}
      {/* <div>{item as string}</div> */}
      {/* <div>Hi! I'm Eleazar</div> */}
    </Fragment>
  );
};

export default HomePage;
