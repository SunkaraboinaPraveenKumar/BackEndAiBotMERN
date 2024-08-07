import express from "express";
import cors from 'cors';
import {config} from 'dotenv';
import morgan from 'morgan';
import appRouter from "./Routes/index.js";
import cookieParser from "cookie-parser";
import jwt from 'jsonwebtoken';
import { COOKIE_NAME } from "./utils/constants.js";

config();
//next is used to run next available middlewares

const app=express();

//middlewares
app.use(cors({
    origin:["http://localhost:5173","https://front-end-mern-chat-bot.vercel.app","https://front-end-mern-chat-bot-prw2.vercel.app"],
    credentials:true,
}));
app.use(express.json());

app.use(cookieParser(process.env.COOKIE_SECRET));
const authenticateToken = (req, res, next) => {
    const token = req.signedCookies[COOKIE_NAME];
    if (!token) return res.status(401).json({ message: 'No token found' });
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: 'Token is not valid' });
      res.locals.jwtData = user;
      next();
    });
  };
  
  // Apply middleware globally or to specific routes
  app.use(authenticateToken);

//remove it in production
app.use(morgan('dev'));

app.use("/api/v1",appRouter);



export default app;