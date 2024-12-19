import { Router, Request, Response, NextFunction } from "express";
import { OrderController } from "../controller/OrderController";
import { authenticateJWT, authorizeAdmin } from "../middleware/AuthenticationMiddleware";

const router = Router();
const orderController = new OrderController();

// this routs will be used by user
router.post("/book", authenticateJWT, (req: Request , res: Response, next: NextFunction) => orderController.bookGroceries(req, res, next)); 
router.get("/user/:userId", authenticateJWT, (req: Request , res: Response, next: NextFunction) => orderController.getUserOrders(req, res, next));

// this will show all the orders to admin only
router.get("/all", authenticateJWT, authorizeAdmin, (req: Request , res: Response, next: NextFunction) => orderController.getAllOrders(req, res, next)); 

export default router;
