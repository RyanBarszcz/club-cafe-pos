import type { Request, Response, NextFunction } from "express";

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const auth = (req as any).auth;

  if (!auth?.userId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  next();
}