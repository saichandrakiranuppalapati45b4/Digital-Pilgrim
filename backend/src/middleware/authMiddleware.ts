import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';
import { sendError } from '../utils/apiResponse';
import { User, IUser } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      tokenData?: TokenPayload;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Check HttpOnly cookie first
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      sendError(res, 'Authentication required. No token provided.', 401);
      return;
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId).select('-passwordHash');

    if (!user || !user.isActive) {
      sendError(res, 'User session invalid or account inactive.', 401);
      return;
    }

    req.user = user;
    req.tokenData = decoded;
    next();
  } catch (error) {
    sendError(res, 'Invalid or expired authentication credentials.', 401);
  }
};

export const requireRole = (allowedRoles: Array<'admin' | 'editor'>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Authentication required.', 401);
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      sendError(res, 'Access denied. Insufficient permissions.', 403);
      return;
    }

    next();
  };
};
