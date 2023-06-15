import { Schema } from 'mongoose';
import mongoose from '../db/db';

const Thread = {
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lasModified: {
    type: Date,
    default: Date.now,
  },
  messages: [mongoose.Types.ObjectId],
};

export interface threadFromDb {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  modifiedLast: Date;
  messages: [mongoose.Types.ObjectId];
}

const threadSchema = new Schema(Thread);

export { threadSchema };
