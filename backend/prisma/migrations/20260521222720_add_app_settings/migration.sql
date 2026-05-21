-- CreateTable
CREATE TABLE "app_settings" (
    "id" TEXT NOT NULL,
    "cafeName" TEXT NOT NULL DEFAULT 'Liberty Cafe',
    "taxRate" DOUBLE PRECISION NOT NULL DEFAULT 6,
    "enableMemberCharging" BOOLEAN NOT NULL DEFAULT true,
    "enableSelfServiceKiosk" BOOLEAN NOT NULL DEFAULT true,
    "requireManagerApproval" BOOLEAN NOT NULL DEFAULT true,
    "lowStockThreshold" INTEGER NOT NULL DEFAULT 5,
    "requirePinForDiscounts" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_settings_pkey" PRIMARY KEY ("id")
);
