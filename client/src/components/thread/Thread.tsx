import { Fragment, useMemo } from 'react';
import { threadFromDb } from '../../models/thread.models';
import './Thread.css';
import useFetch from '../../hooks/useFetch';
import Loading from '../loading/Loading';
import Error from '../error/Error';
import { useContext } from 'react';
import { authContext } from '../../App';
import { useNavigate } from 'react-router-dom';

export interface threadProp {
  id: string;
}

const Thread: React.FC<threadProp> = (id) => {
  const navigate = useNavigate();
  console.log(id);
  const { data, error, loading } = useFetch({
    path: `/thread/${id.id.toString()}`,
    method: 'get',
  });

  const child = useMemo(() => {
    console.log(data);
    return loading ? (
      <Loading />
    ) : data?.message ? (
      <div>
        <div
          onClick={() => {
            navigate(`/message/:${data?.message._id}`);
          }}
        >
          {(data?.message?._id as string) || <Loading />}
        </div>
      </div>
    ) : error && !loading && !data ? (
      <Error message={error.message} />
    ) : null;
  }, [data, error, loading]);

  return <Fragment>{child}</Fragment>;
};

export default Thread;
