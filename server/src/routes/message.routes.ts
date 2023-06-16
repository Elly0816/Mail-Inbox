import { Request, Response, Router } from 'express';
import { protectedEndpoints } from '../constants/constants';
import {
  addMessageToThread,
  createMessage,
  getMessage,
  markMessageRead,
} from '../controllers/message.controller';
import { Message, message, messageFromDb } from '../models/message.model';
import { getThread } from '../controllers/thread.controller';
import { threadFromDb } from '../models/thread.model';
import mongoose from 'mongoose';

const messageRoute = Router();

const path = `/${protectedEndpoints.message}`;

//Get Message
messageRoute.get(`${path}/:id`, async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    res.status(404).json({ message: 'Message not found' });
  }
  const message = (await getMessage('_id', id)) as messageFromDb;
  if (message) {
    res.status(200).json({ message: message });
  } else {
    res.status(404).json({ message: 'There was an error finding the message' });
  }
});
//Create Message
messageRoute.post(path, async (req: Request, res: Response) => {
  const message = req.body.message as message;
  const { threadId, title, body, from, to } = message;
  if (!(threadId && title && body && from && to)) {
    res
      .status(400)
      .json({ message: 'Make sure you entered the correct fields' });
  }
  const thread = (await getThread('_id', threadId)) as threadFromDb;
  if (thread) {
    const newMessage = await createMessage(message);
    if (newMessage) {
      const messageAddedToThread = await addMessageToThread(
        newMessage._id,
        thread._id
      );
      if (messageAddedToThread) {
        res.status(201).json({ message: newMessage });
      } else {
        res
          .status(500)
          .json({ message: 'Message could not be added to thread' });
      }
    } else {
      res.status(500).json({ message: 'Message could not be created' });
    }
  } else {
    res.status(404).json({ message: 'Could nont find the thread' });
  }
});

//Delete Message

//Read Message
messageRoute.patch(`${path}/:id`, async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    res.status(404).json({ message: 'Message not found' });
  }
  const newMessageId = new mongoose.Types.ObjectId(id);
  const message = await markMessageRead(newMessageId);
  if (message) {
    const message = await getMessage('_id', id);
    res.status(200).json({ message: message });
  } else {
    res.status(404).json({ message: 'Could nont find the message' });
  }
});

export default messageRoute;
