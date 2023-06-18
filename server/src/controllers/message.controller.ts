import mongoose, { ObjectId } from 'mongoose';
import { messageFromDb, Message, message } from '../models/message.model';
import { Thread, threadFromDb } from '../models/thread.model';

const getMessage = async (
  field: keyof messageFromDb | null | undefined,
  value: string | ObjectId
): Promise<messageFromDb | messageFromDb[] | undefined> => {
  if (field) {
    switch (field) {
      case '_id':
        if (typeof value === 'string') {
          const id = new mongoose.Types.ObjectId(value);
          const message = (await Message.findById(id).lean()) as messageFromDb;
          return message;
        } else {
          const message = (await Message.findById(
            value
          ).lean()) as messageFromDb;
          return message;
        }
      case 'from':
        if (typeof value === 'string') {
          const id = new mongoose.Types.ObjectId(value);
          const message = (await Message.findOne({
            from: id,
          }).lean()) as messageFromDb;
          return message;
        } else {
          const message = (await Message.findOne({
            from: value,
          }).lean()) as messageFromDb;
          return message;
        }
      case 'to':
        if (typeof value === 'string') {
          const id = new mongoose.Types.ObjectId(value);
          const message = (await Message.findOne({
            to: id,
          }).lean()) as messageFromDb;
          return message;
        } else {
          const message = (await Message.findOne({
            to: value,
          }).lean()) as messageFromDb;
          return message;
        }
      case 'read':
      case 'date':
      case 'title':
      case 'body':
        return undefined;
    }
  } else {
    const message = (await Message.find().lean()) as messageFromDb;
    return message;
  }
};

//Create Message;
const createMessage = async (
  message: message
): Promise<messageFromDb | undefined> => {
  const newMessage = (await Message.create(message)) as messageFromDb;
  return newMessage ? newMessage : undefined;
};

//Is message in thread;
const messageInThread = async (
  messageId: messageFromDb['_id'],
  threadId: threadFromDb['_id']
): Promise<boolean> => {
  const thread = (await Thread.findById(threadId).lean()) as threadFromDb;
  const messages = thread.messages.map((message) => message.toString());
  const messageIdString = messageId.toString();
  return messages.includes(messageIdString) ? true : false;
};

//Add message to thread
const addMessageToThread = async (
  messageId: messageFromDb['_id'],
  threadId: threadFromDb['_id']
): Promise<boolean> => {
  const thread = (await Thread.findByIdAndUpdate(
    threadId,
    { $push: { messages: messageId.toString() } },
    { new: true }
  ).lean()) as threadFromDb;
  return thread ? true : false;
};

const deleteMessageFromThread = async (
  threadId: threadFromDb['_id'],
  messageId: messageFromDb['_id']
): Promise<boolean> => {
  const thread = await Thread.findByIdAndUpdate(
    threadId,
    { $pull: { messages: messageId.toString() } },
    { new: true }
  ).lean();
  const message = await Message.findByIdAndDelete(messageId).lean();
  if (thread && message) {
    return true;
  }
  return false;
};

const markMessageRead = async (
  messageId: messageFromDb['_id']
): Promise<boolean> => {
  const message = (await Message.findByIdAndUpdate(
    messageId,
    { $set: { read: true } },
    { new: true }
  ).lean()) as messageFromDb;
  if (message) {
    return true;
  } else {
    return false;
  }
};

export {
  deleteMessageFromThread,
  getMessage,
  messageInThread,
  addMessageToThread,
  createMessage,
  markMessageRead,
};
