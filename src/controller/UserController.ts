import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcrypt';
import { User } from '../entity/User';
import { AppDataSource } from '../database/data-source';
import { generateToken } from '../utils/JwtTocken';

export class UserController {
  private userRepository = AppDataSource.getRepository(User);

  private adminCredentials = {
    email: process.env.ADMIN_EMAIL || "admin@example.com",
    password: process.env.ADMIN_PASSWORD|| "admin123",
  };

  async registerUser(req: Request, res: Response, next: NextFunction) {
    const { name, email, password, phone, age } = req.body;
    console.log(name, email, phone, password, age)

    try {

      const existingUser = await this.userRepository.findOneBy({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // console.log(bcrypt)

      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword)

      const user = new User();
      user.name = name;
      user.email = email;
      user.password = hashedPassword;
      user.phone = phone;
      user.age = age;
      user.role = 'user'; 

      const savedUser = await this.userRepository.save(user);

      console.log()
      console.log("============")
      console.log(savedUser)
      console.log("============")
      console.log()
      return res.status(201).json({
        message: 'User registered successfully',
        user: { id: savedUser.id, name: savedUser.name, email: savedUser.email },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async loginUser(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    try {
      if (email === this.adminCredentials.email && password === this.adminCredentials.password) {
        const token = generateToken(this.adminCredentials.email, 'admin'); 
        return res.json({ message: 'Admin login successful', token });
      }

      const user = await this.userRepository.findOneBy({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = generateToken(user.email, user.role);

      return res.json({ message: 'Login successful', token });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
