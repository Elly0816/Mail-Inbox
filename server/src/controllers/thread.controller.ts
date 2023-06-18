import mongoose, { ObjectId } from 'mongoose';
import { threadFromDb, Thread, thread } from '../models/thread.model';
import { User, userFromDb } from '../models/user.model';
import { messageFromDb } from '../models/message.model';

const getThread = async (
  field: keyof threadFromDb | undefined | null,
  value: string | ObjectId
): Promise<threadFromDb | threadFromDb[] | undefined> => {
  if (field) {
    if (value) {
      switch (field) {
        case '_id':
          if (typeof value === 'string') {
            const id = new mongoose.Types.ObjectId(value);
            const thread = (await Thread.findById(id).lean()) as threadFromDb;
            return thread;
          } else {
            const thread = (await Thread.findById(
              value
            ).lean()) as threadFromDb;
            return thread;
          }
        case 'createdAt':
        case 'lastModified':
        case 'messages':
          return undefined;
        default:
          return undefined;
      }
    } else {
      return undefined;
    }
  } else {
    const thread = (await Thread.find().lean()) as threadFromDb[];
    return thread;
  }
};

//Is thread in user
const threadInUser = async (
  userId: userFromDb['_id'],
  threadId: threadFromDb['_id']
): Promise<boolean> => {
  const user = (await User.findById(userId).lean()) as userFromDb;
  let threads = user.threads.map((thread) => thread.toString());
  let newThreadId = threadId.toString();
  return threads.includes(newThreadId) ? true : false;
};

//Add thread to user
const addThreadToUser = async (
  threadId: threadFromDb['_id'],
  userId: userFromDb['_id']
): Promise<boolean> => {
  if (!userId) {
    return false;
  }
  const user = (await User.findOneAndUpdate(
    { _id: userId },
    { $push: { threads: threadId } },
    { new: true }
  ).lean()) as userFromDb;
  return user ? true : false;
};

// Delete thread from user
const deleteThreadFromUser = async (
  threadId: threadFromDb['_id'],
  userId: userFromDb['_id']
): Promise<boolean> => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { threads: threadId } },
    { new: true }
  );
  return user ? true : false;
};

//Create Thread

const createThread = async (
  message: messageFromDb
): Promise<threadFromDb | undefined> => {
  const newThread = await Thread.create({ messages: [message._id] });
  let thread = (await Thread.findById(
    newThread._id
  ).lean()) as unknown as threadFromDb;
  return thread;
};
export {
  createThread,
  getThread,
  threadInUser,
  addThreadToUser,
  deleteThreadFromUser,
};
