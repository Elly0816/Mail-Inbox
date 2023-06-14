import { Request, Router, Response } from 'express';

const homeRoute = Router();

const path: string = '/';

homeRoute.get(path, (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to the home route' });
});

export default homeRoute;
