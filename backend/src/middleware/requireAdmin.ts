import type { Request, Response, NextFunction } from "express";

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const auth = (req as any).auth();

  const role = auth?.sessionClaims?.role;

  if (role !== "admin") {
    return res.status(403).json({
      message: "Admin access required",
    });
  }

  next();
}