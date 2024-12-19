import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "../entity/User"
import { Order } from "../entity/Order"
import { Grocery } from "../entity/Grocery"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "host.docker.internal", 
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || "grocery-booking",
    synchronize: true,
    logging: false,
    entities: [User, Order, Grocery],
    migrations: [],
    subscribers: [],
    
    // type: "mysql",
    // host: process.env.HOST || "localhost",
    // port: Number(process.env.DB_PORT) || 3306,
    // username: process.env.USERNAME || "root",
    // password: process.env.PASSWORD || "root",
    // database: process.env.DB_NAME || "grocery-booking",
    // synchronize: true,
    // logging: false,
    // entities: [User,Order,Grocery],
    // migrations: [],
    // subscribers: [],
})


