"use client";

import { useState } from "react";

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        cafeName: "Liberty Cafe",
        taxRate: "6",
        enableMemberCharging: true,
        enableSelfServiceKiosk: true,
        requireManagerApproval: true,
        lowStockThreshold: "5",
        requirePinForDiscounts: false,
    });

    function updateSetting(key: keyof typeof settings, value: string | boolean) {
        setSettings((prev) => ({
            ...prev,
            [key]: value,
        }));
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-zinc-900">
                    Settings
                </h1>

                <p className="text-zinc-500 mt-2">
                    Configure cafe operations, checkout behavior, and inventory rules.
                </p>
            </div>

            <div className="space-y-6">
                <section className="bg-white rounded-3xl border border-zinc-200 p-6">
                    <h2 className="text-2xl font-bold text-zinc-900 mb-6">
                        Cafe Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-zinc-600 mb-2">
                                Cafe Name
                            </label>

                            <input
                                value={settings.cafeName}
                                onChange={(e) =>
                                    updateSetting("cafeName", e.target.value)
                                }
                                className="w-full bg-zinc-100 border border-zinc-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-zinc-600 mb-2">
                                Tax Rate (%)
                            </label>

                            <input
                                type="number"
                                value={settings.taxRate}
                                onChange={(e) =>
                                    updateSetting("taxRate", e.target.value)
                                }
                                className="w-full bg-zinc-100 border border-zinc-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-3xl border border-zinc-200 p-6">
                    <h2 className="text-2xl font-bold text-zinc-900 mb-6">
                        Checkout Settings
                    </h2>

                    <div className="space-y-5">
                        <SettingToggle
                            title="Enable Member Charging"
                            description="Allow staff and kiosk users to charge purchases to a member account."
                            enabled={settings.enableMemberCharging}
                            onClick={() =>
                                updateSetting(
                                    "enableMemberCharging",
                                    !settings.enableMemberCharging
                                )
                            }
                        />

                        <SettingToggle
                            title="Enable Self-Service Kiosk"
                            description="Allow members to purchase self-serve items without cafe staff."
                            enabled={settings.enableSelfServiceKiosk}
                            onClick={() =>
                                updateSetting(
                                    "enableSelfServiceKiosk",
                                    !settings.enableSelfServiceKiosk
                                )
                            }
                        />

                        <SettingToggle
                            title="Require Manager Approval for Comps"
                            description="Require approval before staff can comp or heavily discount an order."
                            enabled={settings.requireManagerApproval}
                            onClick={() =>
                                updateSetting(
                                    "requireManagerApproval",
                                    !settings.requireManagerApproval
                                )
                            }
                        />
                    </div>
                </section>

                <section className="bg-white rounded-3xl border border-zinc-200 p-6">
                    <h2 className="text-2xl font-bold text-zinc-900 mb-6">
                        Inventory Settings
                    </h2>

                    <div>
                        <label className="block text-sm font-semibold text-zinc-600 mb-2">
                            Default Low Stock Threshold
                        </label>

                        <input
                            type="number"
                            value={settings.lowStockThreshold}
                            onChange={(e) =>
                                updateSetting("lowStockThreshold", e.target.value)
                            }
                            className="w-full max-w-xs bg-zinc-100 border border-zinc-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                        />

                        <p className="text-sm text-zinc-500 mt-2">
                            Products at or below this count will show as low stock.
                        </p>
                    </div>
                </section>

                <section className="bg-white rounded-3xl border border-zinc-200 p-6">
                    <h2 className="text-2xl font-bold text-zinc-900 mb-6">
                        Security
                    </h2>

                    <SettingToggle
                        title="Require PIN for Discounts"
                        description="Require staff to enter an admin PIN before applying discounts."
                        enabled={settings.requirePinForDiscounts}
                        onClick={() =>
                            updateSetting(
                                "requirePinForDiscounts",
                                !settings.requirePinForDiscounts
                            )
                        }
                    />
                </section>

                <div className="flex justify-end">
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-semibold transition hover:cursor-pointer">
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
}

type SettingToggleProps = {
    title: string;
    description: string;
    enabled: boolean;
    onClick: () => void;
};

function SettingToggle({
    title,
    description,
    enabled,
    onClick,
}: SettingToggleProps) {
    return (
        <div className="flex items-center justify-between gap-6 border-b border-zinc-100 last:border-b-0 pb-5 last:pb-0">
            <div>
                <h3 className="font-semibold text-zinc-900">
                    {title}
                </h3>

                <p className="text-sm text-zinc-500 mt-1">
                    {description}
                </p>
            </div>

            <button
                onClick={onClick}
                className={`w-14 h-8 rounded-full p-1 transition hover:cursor-pointer ${enabled ? "bg-blue-600" : "bg-zinc-300"
                    }`}
            >
                <div
                    className={`w-6 h-6 bg-white rounded-full transition ${enabled ? "translate-x-6" : "translate-x-0"
                        }`}
                />
            </button>
        </div>
    );
}