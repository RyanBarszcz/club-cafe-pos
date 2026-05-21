import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

async function getOrCreateSettings() {
  const existing = await prisma.appSettings.findFirst();

  if (existing) return existing;

  return prisma.appSettings.create({
    data: {},
  });
}

export async function getSettings(req: Request, res: Response) {
  try {
    const settings = await getOrCreateSettings();

    return res.status(200).json(settings);
  } catch (error) {
    console.error("Get settings error:", error);

    return res.status(500).json({
      message: "Failed to get settings",
    });
  }
}

export async function updateSettings(req: Request, res: Response) {
  try {
    const currentSettings = await getOrCreateSettings();

    const {
      cafeName,
      taxRate,
      enableMemberCharging,
      enableSelfServiceKiosk,
      requireManagerApproval,
      lowStockThreshold,
      requirePinForDiscounts,
    } = req.body;

    const updatedSettings = await prisma.appSettings.update({
      where: {
        id: currentSettings.id,
      },
      data: {
        ...(cafeName !== undefined && { cafeName }),
        ...(taxRate !== undefined && { taxRate: Number(taxRate) }),
        ...(enableMemberCharging !== undefined && {
          enableMemberCharging,
        }),
        ...(enableSelfServiceKiosk !== undefined && {
          enableSelfServiceKiosk,
        }),
        ...(requireManagerApproval !== undefined && {
          requireManagerApproval,
        }),
        ...(lowStockThreshold !== undefined && {
          lowStockThreshold: Number(lowStockThreshold),
        }),
        ...(requirePinForDiscounts !== undefined && {
          requirePinForDiscounts,
        }),
      },
    });

    return res.status(200).json(updatedSettings);
  } catch (error) {
    console.error("Update settings error:", error);

    return res.status(500).json({
      message: "Failed to update settings",
    });
  }
}