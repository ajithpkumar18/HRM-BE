import { NextFunction, Request, Response } from "express";
declare global {
    namespace Express {
        interface Request {
            user?: {
                role?: string;
                [key: string]: any;
                userID?: string;
            };
        }
    }
}
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../schema/UserModels";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies['access_token'];

    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    try {
        let decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        const user = await User.findOne({ _id: decoded.id });


        if (!user) {
            res.status(401).json({ message: 'Unauthorized' });
            return
        }

        (req as any).user = user;

        if (req.params.id == "") { req.params.id = user.companyID ?? req.params.id; }
        (req as any).userID = user._id.toString();


        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

}

export const authorizeRoles = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const userRole = req.user?.role;

        if (!userRole || !roles.includes(userRole)) {
            res.status(403).json({ message: "Access denied" });
        } else {
            next();
        }
    };
};





