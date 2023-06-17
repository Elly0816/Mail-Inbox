import { useNavigate } from 'react-router-dom';
import './homepage.css';
import React, { Fragment } from 'react';
import useFetch from '../../hooks/useFetch';
import Loading from '../../components/loading/Loading';
import useLocalStorage from '../../hooks/useLocalStorage';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface homePageProp {}

const HomePage: React.FC<homePageProp> = () => {
  //   const [threads, setThread] = useThread();
  const navigate = useNavigate();
  const [item] = useLocalStorage({ name: 'thing', value: 'another' });
  const { data, error, loading, setCurrent } = useFetch({
    path: '',
    method: 'get',
  });

  const child = loading ? (
    <Loading />
  ) : data ? (
    <div>
      {Object.entries(data).map((value, index) => (
        <h3 key={index}>{value}</h3>
      ))}
    </div>
  ) : (
    <div>
      <h2>{error?.message}</h2>
    </div>
  );

  return (
    <Fragment>
      {child}
      {/* <div>{item as string}</div> */}
      <div>Hi! I'm Eleazar</div>
      <button
        onClick={() => {
          navigate('/login');
        }}
      >
        Login
      </button>
    </Fragment>
  );
};

export default HomePage;
