import express, { urlencoded, json } from 'express';
import homeRoute from './routes/home.routes';
import { config } from 'dotenv';

config();

const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(homeRoute);

app.listen();
