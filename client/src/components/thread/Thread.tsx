import { Fragment, useMemo } from 'react';
import { threadFromDb } from '../../models/thread.models';
import './Thread.css';
import useFetch from '../../hooks/useFetch';
import Loading from '../loading/Loading';
import Error from '../error/Error';
import { useContext } from 'react';
import { authContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import { getNameFromUser } from '../../utils/types/helper/helper';

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

  const child = loading ? (
    <Loading />
  ) : data?.message ? (
    <div>
      <div
        onClick={() => {
          navigate(`/message/:${data?.message._id}`);
        }}
      >
        {(
          <h3>Click to open thread with {getNameFromUser(data?.otherUser)}</h3>
        ) || <Loading />}
        {data?.unread > 0 ? (
          <h4>
            You have {data.unread} unread messages from{' '}
            {data.messages.messages.length}
          </h4>
        ) : // <h4>You have no unread messages</h4>
        null}
      </div>
    </div>
  ) : error && !loading && !data ? (
    <Error message={error.message} />
  ) : null;

  return <Fragment>{child}</Fragment>;
};

export default Thread;
