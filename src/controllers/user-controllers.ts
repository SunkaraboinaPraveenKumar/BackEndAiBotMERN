import { Request, Response, NextFunction } from 'express';
import User from '../models/User.js';
import { hash, compare } from 'bcrypt';
import { createToken } from '../utils/token-manager.js';
import { COOKIE_NAME } from '../utils/constants.js';
import { CookieOptions } from 'express';

// Define cookie options
const COOKIE_OPTIONS: CookieOptions = {
    path: "/",
    domain: "localhost",
    httpOnly: true,
    signed: true,
    sameSite: 'none' as 'none', // Explicitly type 'none'
    secure: process.env.NODE_ENV === 'production' // Ensure you use HTTPS in production
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find();
        return res.status(200).json({ message: 'ok', users });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ message: 'Error', cause: error.message });
    }
};

export const userSignUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(401).send("User Already Exists");
        }
        const hashedPassword = await hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);

        res.clearCookie(COOKIE_NAME, COOKIE_OPTIONS);

        res.cookie(COOKIE_NAME, token, {
            ...COOKIE_OPTIONS,
            expires,
        });

        return res.status(201).json({ message: 'ok', name: user.name, email: user.email });
    } catch (error) {
        console.error("Error during signup:", error);
        return res.status(500).json({ message: 'Error', cause: error.message });
    }
};

export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send("User Not Registered");
        }
        const isPasswordCorrect = await compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(403).send("Incorrect Password");
        }

        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);

        res.clearCookie(COOKIE_NAME, COOKIE_OPTIONS);

        res.cookie(COOKIE_NAME, token, {
            ...COOKIE_OPTIONS,
            expires,
        });

        return res.status(200).json({ message: 'ok', name: user.name, email: user.email });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: 'Error', cause: error.message });
    }
};

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User Not Registered or Token malfunctioned!");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions Do Not Match!");
        }
        return res.status(200).json({ message: 'ok', name: user.name, email: user.email });
    } catch (error) {
        console.error("Error verifying user:", error);
        return res.status(500).json({ message: 'Error', cause: error.message });
    }
};

export const userLogout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User Not Registered or Token malfunctioned!");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions Do Not Match!");
        }
        res.clearCookie(COOKIE_NAME, {
            path: "/",
            domain: "localhost",
            sameSite: 'none' as 'none', // Explicitly type 'none'
            secure: process.env.NODE_ENV === 'production', // Ensure you use HTTPS in production
        });
        return res.status(200).json({ message: 'ok', name: user.name, email: user.email });
    } catch (error) {
        console.error("Error during logout:", error);
        return res.status(500).json({ message: 'Error', cause: error.message });
    }
};
