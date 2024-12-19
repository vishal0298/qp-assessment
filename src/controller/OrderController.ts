import { AppDataSource } from "../database/data-source";
import { Request, Response, NextFunction } from "express";
import { Order } from "../entity/Order";
import { User } from "../entity/User";
import { Grocery } from "../entity/Grocery";

export class OrderController {
  private orderRepository = AppDataSource.getRepository(Order);
  private userRepository = AppDataSource.getRepository(User);
  private groceryRepository = AppDataSource.getRepository(Grocery);

  async bookGroceries(req: Request, res: Response, next: NextFunction) {
    const { userId, groceryIds } = req.body;
    let totalAmount = 0;

    try {
      
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      
      const groceries = await this.groceryRepository.findByIds(groceryIds);
      if (groceries.length !== groceryIds.length) {
        return res.status(400).json({ message: "One or more groceries not found" });
      }

      groceries.forEach((grocery) => {
        if (grocery.inventory <= 0) {
          throw new Error(`Grocery item ${grocery.name} is out of stock`);
        }
        totalAmount += Number(grocery.price);
      });

      
      for (const grocery of groceries) {
        grocery.inventory -= 1;
        await this.groceryRepository.save(grocery);
      }

      
      const order = new Order();
      order.user = user;
      order.groceries = groceries.map((g) => g.id);
      order.totalAmount = totalAmount;
      order.status = "pending"; 

      const savedOrder = await this.orderRepository.save(order);
      return res.status(201).json({ message: "Order placed successfully", order: savedOrder });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error", error: err.message });
    }
  }

  
  async getUserOrders(req: Request, res: Response, next: NextFunction) {
    const userId = parseInt(req.params.userId);

    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const orders = await this.orderRepository.find({ where: { user: { id: userId } } });
      return res.status(200).json(orders);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  
  async getAllOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await this.orderRepository.find({ relations: ["user"] });
      return res.status(200).json(orders);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
