"use client";

import { useMemo, useState } from "react";

type TeamMember = {
    id: number;
    name: string;
    email: string;
    role: "Admin" | "Staff";
    status: "Active" | "Inactive";
};

const initialTeamMembers: TeamMember[] = [
    {
        id: 1,
        name: "Ryan Barszcz",
        email: "ryan@libertypos.com",
        role: "Admin",
        status: "Active",
    },
    {
        id: 2,
        name: "Cafe Staff",
        email: "staff@libertypos.com",
        role: "Staff",
        status: "Active",
    },
    {
        id: 3,
        name: "Front Desk",
        email: "frontdesk@libertypos.com",
        role: "Staff",
        status: "Inactive",
    },
];

export default function TeamPage() {
    const [teamMembers, setTeamMembers] = useState(initialTeamMembers);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "Staff" as "Admin" | "Staff",
        status: "Active" as "Active" | "Inactive",
    });

    const filteredTeamMembers = useMemo(() => {
        return teamMembers.filter((member) => {
            const matchesSearch =
                member.name.toLowerCase().includes(search.toLowerCase()) ||
                member.email.toLowerCase().includes(search.toLowerCase());

            const matchesRole =
                roleFilter === "All" || member.role === roleFilter;

            return matchesSearch && matchesRole;
        });
    }, [teamMembers, search, roleFilter]);

    function openCreateModal() {
        setEditingMember(null);
        setFormData({
            name: "",
            email: "",
            role: "Staff",
            status: "Active",
        });
        setIsModalOpen(true);
    }

    function openEditModal(member: TeamMember) {
        setEditingMember(member);
        setFormData({
            name: member.name,
            email: member.email,
            role: member.role,
            status: member.status,
        });
        setIsModalOpen(true);
    }

    function handleSaveMember() {
        if (!formData.name || !formData.email) return;

        if (editingMember) {
            setTeamMembers((prev) =>
                prev.map((member) =>
                    member.id === editingMember.id
                        ? { ...member, ...formData }
                        : member
                )
            );
        } else {
            setTeamMembers((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    ...formData,
                },
            ]);
        }

        setIsModalOpen(false);
    }

    function handleDeleteMember(id: number) {
        setTeamMembers((prev) => prev.filter((member) => member.id !== id));
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-zinc-900">
                        Team
                    </h1>

                    <p className="text-zinc-500 mt-2">
                        Create, edit, and manage admin and staff accounts.
                    </p>
                </div>

                <button
                    onClick={openCreateModal}
                    className="bg-blue-600 hover:bg-blue-500 transition text-white px-5 py-3 rounded-2xl font-semibold hover:cursor-pointer"
                >
                    + Add Member
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-zinc-200 p-6">
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search team members..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 bg-zinc-100 border border-zinc-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                    />

                    <div className="flex gap-2">
                        {["All", "Admin", "Staff"].map((role) => (
                            <button
                                key={role}
                                onClick={() => setRoleFilter(role)}
                                className={`px-4 py-3 rounded-2xl font-semibold transition hover:cursor-pointer ${roleFilter === role
                                    ? "bg-blue-600 text-white"
                                    : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                                    }`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                </div>

                <table className="w-full">
                    <thead>
                        <tr className="border-b border-zinc-200">
                            <th className="text-left py-4 px-3 text-sm font-semibold text-zinc-500">
                                Name
                            </th>
                            <th className="text-left py-4 px-3 text-sm font-semibold text-zinc-500">
                                Email
                            </th>
                            <th className="text-left py-4 px-3 text-sm font-semibold text-zinc-500">
                                Role
                            </th>
                            <th className="text-left py-4 px-3 text-sm font-semibold text-zinc-500">
                                Status
                            </th>
                            <th className="text-right py-4 px-3 text-sm font-semibold text-zinc-500">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredTeamMembers.map((member) => (
                            <tr
                                key={member.id}
                                className="border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50 transition"
                            >
                                <td className="py-5 px-3 font-semibold text-zinc-900">
                                    {member.name}
                                </td>

                                <td className="py-5 px-3 text-zinc-500">
                                    {member.email}
                                </td>

                                <td className="py-5 px-3">
                                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                                        {member.role}
                                    </span>
                                </td>

                                <td className="py-5 px-3">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-semibold ${member.status === "Active"
                                            ? "bg-green-50 text-green-600"
                                            : "bg-zinc-100 text-zinc-500"
                                            }`}
                                    >
                                        {member.status}
                                    </span>
                                </td>

                                <td className="py-5 px-3">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => openEditModal(member)}
                                            className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-xl font-semibold transition hover:cursor-pointer"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDeleteMember(member.id)
                                            }
                                            className="bg-red-50 hover:bg-red-100 text-red-500 px-4 py-2 rounded-xl font-semibold transition hover:cursor-pointer"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-xl">
                        <h2 className="text-2xl font-bold text-zinc-900 mb-6">
                            {editingMember ? "Edit Team Member" : "Add Team Member"}
                        </h2>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-zinc-600 mb-2">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter full name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                    className="w-full bg-zinc-100 border border-zinc-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-zinc-600 mb-2">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    placeholder="Enter email address"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            email: e.target.value,
                                        })
                                    }
                                    className="w-full bg-zinc-100 border border-zinc-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-zinc-600 mb-2">
                                    Role
                                </label>

                                <select
                                    value={formData.role}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            role: e.target.value as "Admin" | "Staff",
                                        })
                                    }
                                    className="w-full bg-zinc-100 border border-zinc-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                                >
                                    <option value="Admin">Admin</option>
                                    <option value="Staff">Staff</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-zinc-600 mb-2">
                                    Account Status
                                </label>

                                <select
                                    value={formData.status}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            status: e.target.value as
                                                | "Active"
                                                | "Inactive",
                                        })
                                    }
                                    className="w-full bg-zinc-100 border border-zinc-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-600 px-5 py-3 rounded-2xl font-semibold hover:cursor-pointer"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSaveMember}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-2xl font-semibold hover:cursor-pointer"
                            >
                                Save Member
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}