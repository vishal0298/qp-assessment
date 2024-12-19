import { Router, Request, Response, NextFunction } from "express";
import { UserController } from "../controller/UserController";

const router = Router();
const userController = new UserController();


router.post("/register", (req: Request , res: Response, next: NextFunction) => userController.registerUser(req, res, next)); 
router.post("/login", (req: Request , res: Response, next: NextFunction) => userController.loginUser(req, res, next)); 

export default router;
