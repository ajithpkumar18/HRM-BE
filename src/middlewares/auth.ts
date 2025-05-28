import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies['access_token'];
    console.log(req.cookies, "cookies");
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    try {
        let decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        console.log(decoded, "decoded");

        if (!decoded) {
            res.status(401).json({ message: 'Unauthorized' });
            return
        }

        (req as any).isAdmin = (decoded as JwtPayload).isAdmin;
        (req as any).id = (decoded as JwtPayload).id;

        next();
    }
    catch (error) {
        console.log(error);
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

}





