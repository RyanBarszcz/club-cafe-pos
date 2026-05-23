"use client";

import { useEffect, useMemo, useState } from "react";
import {
    fetchTeamMembers,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
} from "../../../lib/api";
import { useAuth } from "@clerk/nextjs";

type TeamMember = {
    id: string;
    name: string | null;
    username: string;
    role: "ADMIN" | "STAFF";
    active: boolean;
};

export default function TeamPage() {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        password: "",
        role: "Staff" as "Admin" | "Staff",
        status: "Active" as "Active" | "Inactive",
    });
    const { getToken } = useAuth();

    async function loadTeamMembers() {
        try {
            setIsLoading(true);
            const token = await getToken({ template: "pos-admin" });
            const users = await fetchTeamMembers(token);
            setTeamMembers(users);
        } catch (error) {
            console.error(error);
            setError("Failed to load team members");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadTeamMembers();
    }, []);

    const filteredTeamMembers = useMemo(() => {
        return teamMembers.filter((member) => {
            const matchesSearch =
                member.name?.toLowerCase().includes(search.toLowerCase()) ||
                member.username.toLowerCase().includes(search.toLowerCase());

            const displayRole = member.role === "ADMIN" ? "Admin" : "Staff";

            const matchesRole =
                roleFilter === "All" || displayRole === roleFilter;

            return matchesSearch && matchesRole;
        });
    }, [teamMembers, search, roleFilter]);

    function openCreateModal() {
        setEditingMember(null);
        setFormData({
            name: "",
            password: "",
            role: "Staff",
            status: "Active",
        });
        setIsModalOpen(true);
    }

    function openEditModal(member: TeamMember) {
        setEditingMember(member);
        setFormData({
            name: member.name ?? "",
            password: "",
            role: member.role === "ADMIN" ? "Admin" : "Staff",
            status: member.active ? "Active" : "Inactive",
        });
        setIsModalOpen(true);
    }

    async function handleSaveMember() {
        try {
            if (!formData.name) return;

            const token = await getToken({ template: "pos-admin" });

            if (editingMember) {
                const updatedMember = await updateTeamMember(editingMember.id, {
                    name: formData.name,
                    role: formData.role,
                    active: formData.status === "Active",
                }, token);

                setTeamMembers((prev) =>
                    prev.map((member) =>
                        member.id === editingMember.id ? updatedMember : member
                    )
                );
            } else {
                if (!formData.password) return;

                const token = await getToken({ template: "pos-admin" });

                const newMember = await createTeamMember({
                    name: formData.name,
                    password: formData.password,
                    role: formData.role,
                    status: formData.status,
                }, token);

                setTeamMembers((prev) => [newMember, ...prev]);
            }

            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            setError("Failed to save team member");
        }
    }

    async function handleDeleteMember(id: string) {
        try {
            const token = await getToken({ template: "pos-admin" });
            const updatedMember = await deleteTeamMember(id, token);

            setTeamMembers((prev) =>
                prev.map((member) =>
                    member.id === id ? updatedMember : member
                )
            );
        } catch (error) {
            console.error(error);
            setError("Failed to deactivate team member");
        }
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-zinc-900">Team</h1>
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

            {error && (
                <div className="mb-4 bg-red-50 text-red-600 px-4 py-3 rounded-2xl font-semibold">
                    {error}
                </div>
            )}

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

                {isLoading ? (
                    <p className="text-zinc-500">Loading team members...</p>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-zinc-200">
                                <th className="text-left py-4 px-3 text-sm font-semibold text-zinc-500">
                                    Name
                                </th>
                                <th className="text-left py-4 px-3 text-sm font-semibold text-zinc-500">
                                    Username
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
                                        {member.username}
                                    </td>

                                    <td className="py-5 px-3">
                                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                                            {member.role === "ADMIN"
                                                ? "Admin"
                                                : "Staff"}
                                        </span>
                                    </td>

                                    <td className="py-5 px-3">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-semibold ${member.active
                                                ? "bg-green-50 text-green-600"
                                                : "bg-zinc-100 text-zinc-500"
                                                }`}
                                        >
                                            {member.active
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </td>

                                    <td className="py-5 px-3">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() =>
                                                    openEditModal(member)
                                                }
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
                                                Deactivate
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-xl">
                        <h2 className="text-2xl font-bold text-zinc-900 mb-6">
                            {editingMember
                                ? "Edit Team Member"
                                : "Add Team Member"}
                        </h2>

                        <div className="space-y-5">
                            <input
                                type="text"
                                placeholder="Full name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                className="w-full bg-zinc-100 border border-zinc-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                            />

                            {!editingMember && (
                                <input
                                    type="password"
                                    placeholder="Temporary password"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            password: e.target.value,
                                        })
                                    }
                                    className="w-full bg-zinc-100 border border-zinc-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                                />
                            )}

                            <select
                                value={formData.role}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        role: e.target.value as
                                            | "Admin"
                                            | "Staff",
                                    })
                                }
                                className="w-full bg-zinc-100 border border-zinc-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                            >
                                <option value="Admin">Admin</option>
                                <option value="Staff">Staff</option>
                            </select>

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