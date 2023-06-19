import { Fragment } from 'react';
import { messageFromDb } from '../../models/message.models';

const Message: React.FC<{ message: messageFromDb }> = ({ message }) => {
  console.log('xx', message);
  return <Fragment>{`${(message.body, message.from)}`}</Fragment>;
};

export default Message;
