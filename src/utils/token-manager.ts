import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "./constants.js";

export const createToken = (id: string, email: string, expiresIn: string) => {
    try {
        const payload = { id, email };
        const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn });
        return token;
    } catch (error) {
        console.error("Error creating token:", error);
        throw new Error("Token creation failed");
    }
};

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.signedCookies[COOKIE_NAME];
    if (!token || token.trim() === "") {
        return res.status(401).json({ message: 'Token Not Received' });
    }

    try {
        const decoded = await new Promise<any>((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });

        res.locals.jwtData = decoded;
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        res.status(401).json({ message: "Token Expired or Invalid!" });
    }
};
