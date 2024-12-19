import * as express from "express"
import * as bodyParser from "body-parser"
import * as dotenv from "dotenv";
import * as mysql from "mysql2/promise";
import { AppDataSource } from "./database/data-source"
import userRoutes from "./routes/userRoutes";
import groceryRoutes from "./routes/groceryRoutes";
import orderRoutes from "./routes/orderRoutes";


dotenv.config();
const app = express()
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json())

app.use("/api/users", userRoutes); 
app.use("/api/groceries", groceryRoutes);
app.use("/api/orders", orderRoutes); 


const checkAndCreateDatabase = async () => {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "host.docker.internal",
      user: process.env.DB_USERNAME || "root", 
      password: process.env.DB_PASSWORD || "root", 
    });
  
    try {
      await connection.query(`USE \`grocery-booking\``);
      console.log("Database exists.");
    } catch (err: any) {
      if (err.code === "ER_BAD_DB_ERROR") {
        console.log("Database doesn't exist. Creating...");
        await connection.query(`CREATE DATABASE \`grocery-booking\``);
        console.log("Database created.");
      } else {
        throw err;
      }
    } finally {
      await connection.end(); 
    }
  };
  
const initializeApp = async () => {
  
  await checkAndCreateDatabase();

  
  await AppDataSource.initialize()
    .then(() => {
      console.log("Data Source has been initialized!");
      app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
    })
    .catch((err) => {
      console.error("Error during Data Source initialization:", err);
    });
};

initializeApp();
