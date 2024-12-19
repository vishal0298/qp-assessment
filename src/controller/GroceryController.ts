import { AppDataSource } from "../database/data-source";
import { Request, Response, NextFunction } from "express";
import { Grocery } from "../entity/Grocery";
import { MoreThan } from "typeorm";

export class GroceryController {
  private groceryRepository = AppDataSource.getRepository(Grocery);

  
  async addGrocery(req: Request, res: Response, next: NextFunction) {
    const { name, price, description, inventory } = req.body;

    try {
      const grocery = new Grocery();
      grocery.name = name;
      grocery.price = price;
      grocery.description = description;
      grocery.inventory = inventory;

      const savedGrocery = await this.groceryRepository.save(grocery);
      return res.status(201).json({ message: "Grocery added successfully", grocery: savedGrocery });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

 
  async getGroceries(req: Request, res: Response, next: NextFunction) {
    try {
      const groceries = await this.groceryRepository.find();
      return res.status(200).json(groceries);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  
  async removeGrocery(req: Request, res: Response, next: NextFunction) {
    const groceryId = parseInt(req.params.id);

    try {
      const grocery = await this.groceryRepository.findOneBy({ id: groceryId });

      if (!grocery) {
        return res.status(404).json({ message: "Grocery not found" });
      }

      await this.groceryRepository.remove(grocery);
      return res.status(200).json({ message: "Grocery removed successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  
  async updateGrocery(req: Request, res: Response, next: NextFunction) {
    const groceryId = parseInt(req.params.id);
    const { name, price, description, inventory, imageUrl } = req.body;

    try {
      const grocery = await this.groceryRepository.findOneBy({ id: groceryId });

      if (!grocery) {
        return res.status(404).json({ message: "Grocery not found" });
      }

      grocery.name = name ?? grocery.name;
      grocery.price = price ?? grocery.price;
      grocery.description = description ?? grocery.description;
      grocery.inventory = inventory ?? grocery.inventory;

      const updatedGrocery = await this.groceryRepository.save(grocery);
      return res.status(200).json({ message: "Grocery updated successfully", grocery: updatedGrocery });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  
  async updateInventory(req: Request, res: Response, next: NextFunction) {
    const groceryId = parseInt(req.params.id);
    const { inventory } = req.body;

    try {
      const grocery = await this.groceryRepository.findOneBy({ id: groceryId });

      if (!grocery) {
        return res.status(404).json({ message: "Grocery not found" });
      }

      grocery.inventory = inventory;

      const updatedGrocery = await this.groceryRepository.save(grocery);
      return res.status(200).json({ message: "Inventory updated successfully", grocery: updatedGrocery });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  
  async getAvailableGroceries(req: Request, res: Response, next: NextFunction) {
    try {
      const groceries = await this.groceryRepository.find({ where: { inventory: MoreThan(0) } });
      return res.status(200).json(groceries);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
