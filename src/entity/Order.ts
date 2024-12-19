import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Column("simple-array")
  groceries: number[];  

  @Column("decimal")
  totalAmount: number;

  @Column()
  status: string;  
}
