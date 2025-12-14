import { NextFunction, Response, Request } from 'express';
import jwt from 'jsonwebtoken';
const JWT_ACCESS_SECRET = 'jwtaccesssercret';
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  req.isAuthenticated = false;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET as string);
    req.user = decoded as Express.User;
    req.isAuthenticated = true;
    next();
  } catch (e) {
    next();
  }
};
