import { Fragment, useContext, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import Error from '../../components/error/Error';
import Loading from '../../components/loading/Loading';
import Message from '../../components/message/Message';
import { authContext } from '../../App';
import { messageFromDb } from '../../models/message.models';
import Compose from '../../components/compose/Compose';

const MessagePage: React.FC<{ match: any; location: any }> = ({ location }) => {
  //   console.log(match, location.pathname.split(':').at(-1));
  const path = location.pathname.split(':').at(-1);
  const { data, loading, error } = useFetch({
    method: 'get',
    path: `/message/${path}`,
  });

  return (
    <Fragment>
      {data
        ? data.message.map((m: any) => <Message key={m._id} message={m} />)
        : 'loading...'}
      <Compose to={data?.otherUser} method={'post'} threadId={path} />
    </Fragment>
  );
};

export default MessagePage;
