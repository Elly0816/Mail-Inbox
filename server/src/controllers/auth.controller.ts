import jwt from 'jsonwebtoken';
import { userFromDb } from '../models/user.model';
import { config } from 'dotenv';

config();

const signAccess = (user: userFromDb): string => {
  //   console.log(user);
  const token: string = jwt.sign(user, process.env.ACCESS as string, {
    expiresIn: '1h',
  });
  return token;
};

const signRefresh = (user: userFromDb): string => {
  //   console.log(user);
  const token: string = jwt.sign(
    user as object,
    process.env.REFRESH as string,
    {
      expiresIn: '1y',
    }
  );
  return token;
};

const verifyAccess = (accessToken: string): userFromDb | undefined => {
  try {
    let decoded = jwt.verify(
      accessToken,
      process.env.ACCESS as string
    ) as userFromDb;
    return decoded;
  } catch (e) {
    return undefined;
  }
};

const verifyRefresh = (refreshToken: string): userFromDb | undefined => {
  try {
    let decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH as string
    ) as userFromDb;
    return decoded;
  } catch (e) {
    return undefined;
  }
};
export { signAccess, signRefresh, verifyAccess, verifyRefresh };
