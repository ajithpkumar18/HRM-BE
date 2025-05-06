import { Request, Response, Router } from "express";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.get("/dashboard", authMiddleware, (req: Request, res: Response) => {
    res.send("Hello World!");
});

router.get("/employees", authMiddleware, (req: Request, res: Response) => {
    res.send("Hello World!");
});

router.post("/employee", authMiddleware, (req: Request, res: Response) => {
    res.send("Hello World!");
});

router.put("/employee", authMiddleware, (req: Request, res: Response) => {
    res.send("Hello World!");
});

router.get("/leads", authMiddleware, (req: Request, res: Response) => {
    res.send("Hello World!");
});

router.post("/lead", authMiddleware, (req: Request, res: Response) => {
    res.send("Hello World!");
});

router.put("/lead", authMiddleware, (req: Request, res: Response) => {
    res.send("Hello World!");
});

router.get("/holdiays", authMiddleware, (req: Request, res: Response) => {
    res.send("Hello World!");
});

router.post("/holidays", authMiddleware, (req: Request, res: Response) => {
    res.send("Hello World!");
});

router.put("/holidays", authMiddleware, (req: Request, res: Response) => {
    res.send("Hello World!");
});

export default router;