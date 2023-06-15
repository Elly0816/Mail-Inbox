import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

try {
  const connect = async (): Promise<void> => {
    await mongoose.connect(process.env.MONGOCONNECT as string);
  };
  connect();
} catch (e) {
  console.error(e);
}

export default mongoose;
