import { Fragment, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import Error from '../../components/error/Error';
import Loading from '../../components/loading/Loading';
import Message from '../../components/message/Message';
import { authContext } from '../../App';
import { messageFromDb } from '../../models/message.models';

const MessagePage: React.FC<{ match: any; location: any }> = ({
  match,
  location,
}) => {
  //   console.log(match, location.pathname.split(':').at(-1));
  const path = location.pathname.split(':').at(-1);
  const { setUser } = useContext(authContext);
  const { data, loading, error } = useFetch({
    method: 'get',
    path: `/message/${path}`,
  });

  data && console.log(data);

  const child = error ? (
    // <Error message={error.message} />
    <div>Error</div>
  ) : loading ? (
    // <Loading />
    <div>Something</div>
  ) : data ? (
    data.message.map(({ message }: { message: messageFromDb }) => (
      <span key={message.date.toString()}>
        <Message message={message} />
      </span>
    ))
  ) : null;

  useEffect(() => {
    data && setUser && setUser(data.message.user);

    return () => {
      //   second
    };
  }, [data, setUser]);

  return <Fragment>{child}</Fragment>;
};

export default MessagePage;
