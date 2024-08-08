import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "./constants.js";

export const createToken = (id: string, email: string, expiresIn: string) => {
  const payload = { id, email };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
  });
  return token;
};

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.signedCookies[`${COOKIE_NAME}`];
    if (!token || token.trim() === "") {
      console.log('Token Not Received');
      return res.status(401).json({ message: 'Token Not Received'});
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log('Token Expired or Invalid!');
        return res.status(401).json({ message: "Token Expired or Invalid!" });
      }

      res.locals.jwtData = decoded;
      next();
    });
  } catch (error) {
    console.error('Internal Server Error:', error.message);
    return res.status(500).json({ message: 'Internal Server Error', cause: error.message });
  }
};

