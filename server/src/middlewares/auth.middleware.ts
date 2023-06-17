import { Request, Response, NextFunction } from 'express';
import { Endpoints, Headers } from '../constants/constants';
import {
  signAccess,
  signRefresh,
  verifyAccess,
  verifyRefresh,
} from '../controllers/auth.controller';
import { User, userFromDb } from '../models/user.model';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import { config } from 'dotenv';

config();
/*


*/
const serializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // console.log('\n');
  // console.log('\n');
  // console.log('request');
  // console.log('\n');
  // console.log(req.headers);
  // console.log('\n');
  // console.log('\n');
  res.setHeader(Headers.cors, '*');
  res.setHeader(Headers.headers, 'Authorization');
  // const accessUser = verifyAccess(req.headers['access'] as string)
  // const refreshUser = verifyRefresh(req.headers['refresh'] as string)
  // if (accessUser){
  //   const user = await User.findById(accessUser._id).lean() as userFromDb;
  //   if (user){
  //     req.user = user as userFromDb;
  // } else if (refreshUser){
  //       const user = await User.findById(refreshUser._id).lean() as userFromDb;
  //       if (user){
  //         req.user = user as userFromDb;
  //       }
  // }
  const url = req.url.split('/');
  console.log(`The user is: ${req.user}`);
  if (
    (url.at(-1) == Endpoints.login || url.at(-1) == Endpoints.signup) &&
    req.method === 'POST'
  ) {
    next();
  } else {
    // const { access, refresh } = req.headers as {
    //   access: string;
    //   refresh: string;
    // };
    const auth = JSON.parse(req.headers.authorization as string);
    const access = auth?.access.split(' ')[1] as string;
    const refresh = auth?.refresh.split(' ')[1] as string;
    // const refresh = req.headers.Refresh as string;
    const accessUser = verifyAccess(req.headers['access'] as string);
    if (accessUser) {
      const decoded = jwt.decode(access);
      req.user = decoded as unknown as userFromDb;
      console.log(req.user);
      /*
                Make sure the decoded access token
                is valid and is the user
                if so, next()
        */
      if (_.isEqual(decoded, accessUser) && decoded && accessUser) {
        next();
      } else {
        //Access decoded token and access user do not match
        const refreshUser = verifyRefresh(req.headers['refresh'] as string);
        const decoded = jwt.decode(refresh);
        console.log('\n\n' + refreshUser);
        console.log(decoded);
        console.log('Refresh user and decoded are above\n\n');
        if (_.isEqual(decoded, refreshUser) && decoded && refreshUser) {
          req.user = refreshUser;
          const accessToken = signAccess(req.user as userFromDb);
          const refreshToken = signRefresh(req.user as userFromDb);
          res.setHeader(Headers.access, accessToken);
          res.setHeader(Headers.refresh, refreshToken);
          next();
        } else {
          res.status(401).json({ message: 'UnAuthorized' });
        }
      }
    } else {
      //No access token
      res.status(401).json({ message: 'UnAuthorized' });
    }
  }
};

const deSerializeUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  /*
        remove the access token and refresh token 
        from the server and client

        set the req.user object to undefined
    
    */
  if (req.user) {
    req.user = undefined;
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized!' });
  }
};

export { serializeUser, deSerializeUser };
