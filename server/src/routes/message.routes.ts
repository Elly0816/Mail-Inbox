import { Request, Response, Router } from 'express';
import { protectedEndpoints } from '../constants/constants';
import {
  addMessageToThread,
  createMessage,
  getMessage,
  markMessageRead,
} from '../controllers/message.controller';
import { Message, message, messageFromDb } from '../models/message.model';
import {
  addThreadToUser,
  createThread,
  getThread,
} from '../controllers/thread.controller';
import { Thread, threadFromDb } from '../models/thread.model';
import mongoose, { ObjectId, isValidObjectId } from 'mongoose';
import { getUser } from '../controllers/user.controller';

const messageRoute = Router();

const path = `/${protectedEndpoints.message}`;

//Get Message
messageRoute.get(`${path}/:id`, async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    res.status(400).send({ message: 'Invalid Object Id' });
  } else {
    if (!id) {
      res.status(404).json({ message: 'Message not found' });
    }
    // const message = (await getMessage('_id', id)) as messageFromDb;
    const thread = (await getThread('_id', id)) as threadFromDb;
    const messageIds = thread.messages;
    const messagesP = messageIds.map(
      async (id) => (await Message.findById(id).lean()) as messageFromDb
    );
    const messages = await Promise.all(messagesP);
    const newMessages = await Promise.all(messages);
    if (newMessages) {
      res.status(200).json({ message: newMessages, user: req.user });
    } else {
      res
        .status(404)
        .json({ message: 'There was an error finding the message' });
    }
  }
});
//Create Message
messageRoute.post(path, async (req: Request, res: Response) => {
  const message = req.body.message as message;
  const { threadId, title, body, from, to } = message;
  const otherUser = await getUser('email', to);
  if (!(title && body && from && to)) {
    res
      .status(400)
      .json({ message: 'Make sure you entered the correct fields' });
  } else {
    const thread = (await getThread('_id', threadId)) as threadFromDb;
    const newMessage = (await createMessage(message)) as messageFromDb;
    if (thread) {
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
      const thread = await createThread(newMessage);
      const added = await addMessageToThread(
        new mongoose.Types.ObjectId(newMessage._id),
        new mongoose.Types.ObjectId(thread?._id)
      );
      if (added) {
        const toUser = await addThreadToUser(
          new mongoose.Types.ObjectId(thread?._id),
          new mongoose.Types.ObjectId(req.user?._id)
        );
        if (otherUser) {
          const toOtherUser = await addThreadToUser(
            new mongoose.Types.ObjectId(thread?._id),
            new mongoose.Types.ObjectId(otherUser?._id)
          );
        }
        if (toUser) {
          const user = await getUser('_id', req.user?._id.toString() as string);
          res.status(200).json({ message: user, user: user });
        }
      } else {
        res.status(404).json({ message: 'Could nont find the thread' });
      }
    }
  }
});

//Delete Message

//Read Message
messageRoute.patch(`${path}/:id`, async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    res.status(400).send({ message: 'Invalid Object Id' });
  } else {
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
  }
});

export default messageRoute;
