import { Request, Response, Router, response } from 'express';
import { protectedEndpoints } from '../constants/constants';
import { Thread, thread, threadFromDb } from '../models/thread.model';
import {
  addThreadToUser,
  deleteThreadFromUser,
  getThread,
} from '../controllers/thread.controller';
import { message } from '../models/message.model';
import { createMessage } from '../controllers/message.controller';
import mongoose from 'mongoose';
import { userFromDb } from '../models/user.model';

const threadRoute = Router();

const path = `${protectedEndpoints.thread}`;

threadRoute.get(`/${path}/:id`, async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: 'Bad Request' });
  } else {
    const thread = await getThread('_id', id);
    if (thread) {
      res.status(200).json({ message: thread });
    } else {
      res.status(404).json({ message: 'Thread not found' });
    }
  }
});

threadRoute.post(`/${path}`, async (req: Request, res: Response) => {
  const { message }: { message: message } = req.body;
  if (!message) {
    res.status(400).json({
      message: 'Bad Request, There was no message in the body of the request',
    });
  }
  const newMessage = await createMessage(message);
  let thread = new Thread({ messages: newMessage?._id });
  let userId = req.user;
  const threadAddedToUser = await addThreadToUser(
    thread._id,
    userId?._id as userFromDb['_id']
  );
  if (threadAddedToUser) {
    res.status(201).json({ message: 'Thread added to User' });
  }
  res.status(500).json({ message: 'There was an error' });
});

threadRoute.patch(`/${path}/:id`, async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: 'Proviede a thread Id' });
  }
  const { message }: { message: message } = req.body;
  if (!message) {
    res.status(400).json({
      message: 'Bad Request, There was no message in the body of the request',
    });
  }
});

threadRoute.delete(`/${path}/:id`, async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: 'Proviede a thread Id' });
  }
  const threadId = new mongoose.Types.ObjectId(id);
  const threadDeleted = await deleteThreadFromUser(
    threadId,
    req.user?._id as userFromDb['_id']
  );
  if (threadDeleted) {
    res.status(200).json({ message: 'Thread has been deleted' });
  } else {
    res
      .status(500)
      .json({ message: 'There was an error deleteing the thread' });
  }
});

export default threadRoute;
