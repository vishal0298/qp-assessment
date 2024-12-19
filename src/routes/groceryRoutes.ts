import { Router, Request, Response, NextFunction } from "express";
import { GroceryController } from "../controller/GroceryController";
import { authenticateJWT, authorizeAdmin } from "../middleware/AuthenticationMiddleware";

const router = Router();
const groceryController = new GroceryController();

// this routes will be used by admin only
router.post("/add", authenticateJWT, authorizeAdmin, (req: Request , res: Response, next: NextFunction) => groceryController.addGrocery(req, res, next)); 
router.delete("/:id",authenticateJWT, authorizeAdmin, (req: Request , res: Response, next: NextFunction) => groceryController.removeGrocery(req, res, next)); 
router.put("/:id", authenticateJWT, authorizeAdmin, (req: Request , res: Response, next: NextFunction) => groceryController.updateGrocery(req, res, next)); 
router.patch("/:id/inventory", authenticateJWT, authorizeAdmin,  (req: Request , res: Response, next: NextFunction) => groceryController.updateInventory(req, res, next)); 

// this routes can be used by anyone
router.get("/all", (req: Request , res: Response, next: NextFunction) => groceryController.getGroceries(req, res, next)); 
router.get("/available", (req: Request , res: Response, next: NextFunction) => groceryController.getAvailableGroceries(req, res, next)); 

export default router;
