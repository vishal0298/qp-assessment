import {sign, verify} from 'jsonwebtoken';


export const generateToken = (email: string, role: string) => {
  return sign({ email: email, role: role }, process.env.JWT_SECRET_KEY || 'secret', {
    expiresIn: '1h', 
  });
};

export const verifyToken = (token: string) => {
  try {
    return verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    throw new Error('Invalid token');
  }
};
