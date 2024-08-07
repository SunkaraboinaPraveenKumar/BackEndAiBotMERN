import { Request, Response, NextFunction } from 'express';
import User from '../models/User.js';
import { hash, compare } from 'bcrypt';
import { createToken } from '../utils/token-manager.js';
import { COOKIE_NAME } from '../utils/constants.js';

export const getAuthToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.signedCookies[COOKIE_NAME];
    if (!token) {
      return res.status(401).json({ message: 'No token found' });
    }
    return res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error', cause: error.message });
  }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();
    return res.status(200).json({ message: 'ok', users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error', cause: error.message });
  }
};

export const userSignUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User Already Exists' });
    }
    const hashedPassword = await hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = createToken(user._id.toString(), user.email, "7d");
    res.cookie(COOKIE_NAME, token, {
      path: "/",
      domain: process.env.COOKIE_DOMAIN || "localhost", // Use an environment variable for domain
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      httpOnly: true,
      signed: true,
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production', // Only set secure in production
    });
    return res.status(201).json({ message: 'ok', name: user.name, email: user.email });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error', cause: error.message });
  }
};

export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'User Not Registered' });
    }
    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(403).json({ message: 'Incorrect Password' });
    }

    const token = createToken(user._id.toString(), user.email, "7d");
    res.cookie(COOKIE_NAME, token, {
      path: "/",
      domain: process.env.COOKIE_DOMAIN || "localhost", // Use an environment variable for domain
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      httpOnly: true,
      signed: true,
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production', // Only set secure in production
    });
  
    return res.status(200).json({ message: 'ok', name: user.name, email: user.email });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error', cause: error.message });
  }
};

export const verfiyUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).json({ message: 'User Not Registered or Token malfunctioned!' });
    }
    return res.status(200).json({ message: 'ok', name: user.name, email: user.email });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error', cause: error.message });
  }
};

export const userLogout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie(COOKIE_NAME, {
      path: "/",
      domain: "localhost", // Change to your domain in production
      sameSite: 'none',
      secure: true,
    });
    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error', cause: error.message });
  }
};
