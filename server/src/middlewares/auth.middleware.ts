import { Request, Response, NextFunction } from 'express';
import { Endpoints, Headers } from '../constants/constants';
import {
  signAccess,
  signRefresh,
  verifyAccess,
  verifyRefresh,
} from '../controllers/auth.controller';
import { userFromDb } from '../models/user.model';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

/*


*/
const serializeUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const url = req.url.split('/');
  console.log(`The user is: ${req.user}`);
  if (
    (url.at(-1) == Endpoints.login || url.at(-1) == Endpoints.signup) &&
    req.method === 'POST'
  ) {
    next();
  } else {
    const { access, refresh } = req.headers as {
      access: string;
      refresh: string;
    };
    if (access) {
      const decoded = jwt.decode(access);
      req.user = decoded as unknown as userFromDb;
      console.log(req.user);
      /*
                Make sure the decoded access token
                is valid and is the user
                if so, next()
        */
      const accessUser = verifyAccess(access);
      if (_.isEqual(decoded, accessUser)) {
        next();
      } else {
        //Access decoded token and access user do not match
        const refreshUser = verifyRefresh(refresh);
        const decoded = jwt.decode(refresh);
        console.log(refreshUser);
        console.log(decoded);
        console.log('Refresh user and decoded are above');
        if (_.isEqual(decoded, refreshUser)) {
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
