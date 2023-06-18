import { Fragment, useMemo } from 'react';
import { threadFromDb } from '../../models/thread.models';
import './Thread.css';
import useFetch from '../../hooks/useFetch';
import Loading from '../loading/Loading';
import Error from '../error/Error';

export interface threadProp {
  id: threadFromDb['_id'];
}

const Thread: React.FC<threadProp> = (id) => {
  const { data, error, loading } = useFetch({
    path: `/thread/${id}`,
    method: 'get',
  });

  const child = useMemo(() => {
    return loading ? (
      <Loading />
    ) : (data as string) ? (
      <div>{data as string}</div>
    ) : error ? (
      <Error message={error.message} />
    ) : null;
  }, [data, error, loading]);

  return <Fragment>{child}</Fragment>;
};

export default Thread;
