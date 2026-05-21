import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function startOfWeek() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day;

  return new Date(now.getFullYear(), now.getMonth(), diff);
}

function startOfMonth(offset = 0) {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + offset, 1);
}

function getPercentChange(current: number, previous: number) {
  if (previous === 0 && current === 0) return 0;
  if (previous === 0) return 100;

  return ((current - previous) / previous) * 100;
}

function roundToOneDecimal(value: number) {
  return Math.round(value * 10) / 10;
}

function formatDay(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
  });
}

export async function getAdminDashboard(_req: Request, res: Response) {
  try {
    const today = startOfToday();
    const weekStart = startOfWeek();
    const currentMonthStart = startOfMonth(0);
    const previousMonthStart = startOfMonth(-1);

    const [
      todaysTransactions,
      weeklyTransactions,
      productCount,
      lowStockItems,
      recentTransactions,
      currentMonthTransactions,
      previousMonthTransactions,
    ] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          status: "COMPLETED",
          createdAt: {
            gte: today,
          },
        },
      }),

      prisma.transaction.findMany({
        where: {
          status: "COMPLETED",
          createdAt: {
            gte: weekStart,
          },
        },
      }),

      prisma.product.count({
        where: {
          active: true,
        },
      }),

      prisma.product.findMany({
        where: {
          active: true,
        },
        orderBy: {
          inventoryCount: "asc",
        },
      }),

      prisma.transaction.findMany({
        where: {
          status: "COMPLETED",
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        include: {
          items: true,
        },
      }),

      prisma.transaction.findMany({
        where: {
            status: "COMPLETED",
            createdAt: {
            gte: currentMonthStart,
            },
        },
        }),

        prisma.transaction.findMany({
        where: {
            status: "COMPLETED",
            createdAt: {
            gte: previousMonthStart,
            lt: currentMonthStart,
            },
        },
        }),
    ]);

    const todaysSalesCents = todaysTransactions.reduce(
      (sum, transaction) => sum + transaction.totalCents,
      0
    );

    const currentMonthSalesCents = currentMonthTransactions.reduce(
    (sum, transaction) => sum + transaction.totalCents,
    0
    );

    const previousMonthSalesCents = previousMonthTransactions.reduce(
    (sum, transaction) => sum + transaction.totalCents,
    0
    );

    const salesChangePercent = roundToOneDecimal(
    getPercentChange(currentMonthSalesCents, previousMonthSalesCents)
    );

    const lowStockFiltered = lowStockItems
      .filter((product) => product.inventoryCount <= product.lowStockThreshold)
      .slice(0, 5);

    const weeklySalesMap = new Map<string, number>();

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      weeklySalesMap.set(formatDay(date), 0);
    }

    for (const transaction of weeklyTransactions) {
      const day = formatDay(transaction.createdAt);
      weeklySalesMap.set(
        day,
        (weeklySalesMap.get(day) ?? 0) + transaction.totalCents
      );
    }

    const weeklySales = Array.from(weeklySalesMap.entries()).map(
      ([day, revenueCents]) => ({
        day,
        revenueCents,
      })
    );

    const formattedRecentTransactions = recentTransactions.map(
      (transaction) => {
        const firstItem = transaction.items[0];
        const extraItems = transaction.items.length - 1;

        const title = firstItem
          ? `${firstItem.productNameSnapshot}${
              extraItems > 0 ? ` + ${extraItems} more` : ""
            }`
          : "Transaction";

        return {
          id: transaction.id,
          title,
          paymentMethod: transaction.paymentMethod,
          totalCents: transaction.totalCents,
          createdAt: transaction.createdAt,
        };
      }
    );

    return res.json({
      summary: {
        todaysSalesCents,
        transactionCount: todaysTransactions.length,
        lowStockCount: lowStockFiltered.length,
        productCount,
        salesChangePercent,
      },
      weeklySales,
      lowStockItems: lowStockFiltered.map((product) => ({
        id: product.id,
        name: product.name,
        inventoryCount: product.inventoryCount,
        lowStockThreshold: product.lowStockThreshold,
      })),
      recentTransactions: formattedRecentTransactions,
      cafeStatus: {
        isOpen: true,
        kioskEnabled: true,
      },
    });
  } catch (error) {
    console.error("getAdminDashboard error:", error);

    return res.status(500).json({
      message: "Failed to fetch admin dashboard",
    });
  }
}