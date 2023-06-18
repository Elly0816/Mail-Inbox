import { Fragment } from 'react';
import useFetch from '../../hooks/useFetch';
import Loading from '../loading/Loading';
import Error from '../error/Error';
import { messageFromDb } from '../../models/message.models';

const Message: React.FC<{ message: messageFromDb }> = ({ message }) => {
  //   const { data, loading, error } = useFetch({
  //     method: 'get',
  //     path: `/messages.${id}`,
  //   });

  //   const child = loading ? (
  //     <Loading />
  //   ) : error ? (
  //     <Error message={error.message} />
  //   ) : data ? (
  //     data
  //   ) : null;
  console.log(message);
  return <Fragment>{`${(message.body, message.date, message.from)}`}</Fragment>;
};

export default Message;
