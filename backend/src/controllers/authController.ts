import { Request, Response } from 'express';
import { User } from '../models/User';
import { signToken } from '../utils/jwt';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { loginSchema } from '../validators/authValidator';

const isProduction = process.env.NODE_ENV === 'production';

export const getCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

export const getClearCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
});

export const login = async (req: Request, res: Response): Promise<Response> => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendError(res, parsed.error.format(), 422, 'Invalid login data');
  }

  const { email, password } = parsed.data;
  const user = await User.findOne({ email }).select('+passwordHash');

  if (!user || !user.isActive) {
    return sendError(res, 'Invalid email or password', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return sendError(res, 'Invalid email or password', 401);
  }

  const token = signToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  res.cookie('token', token, getCookieOptions());

  return sendSuccess(
    res,
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    },
    'Login successful'
  );
};

export const logout = async (_req: Request, res: Response): Promise<Response> => {
  res.clearCookie('token', getClearCookieOptions());
  return sendSuccess(res, null, 'Logged out successfully');
};

export const me = async (req: Request, res: Response): Promise<Response> => {
  if (!req.user) {
    return sendError(res, 'Not authenticated', 401);
  }

  return sendSuccess(res, {
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    createdAt: req.user.createdAt,
  });
};

export const refresh = async (req: Request, res: Response): Promise<Response> => {
  if (!req.user) {
    return sendError(res, 'Not authenticated', 401);
  }

  const newToken = signToken({
    userId: req.user._id.toString(),
    email: req.user.email,
    role: req.user.role,
  });

  res.cookie('token', newToken, getCookieOptions());

  return sendSuccess(
    res,
    {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
      token: newToken,
    },
    'Session refreshed'
  );
};
