import type { Request, Response } from "express";
import { clerkClient } from "@clerk/express";
import { prisma } from "../lib/prisma.js";

async function generateUsername(name: string) {
  const parts = name.trim().toLowerCase().split(/\s+/);

  const first = parts[0] ?? "";
  const last = parts[parts.length - 1] ?? "";

  const baseUsername =
    `${first.charAt(0)}${last}`.replace(/[^a-z0-9]/g, "");

  let username = baseUsername;
  let counter = 1;

  // Helps handle duplicates
  while (true) {
    const existing = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!existing) break;

    username = `${baseUsername}${counter}`;
    counter++;
  }

  return username;
}

export async function createTeamMember(req: Request, res: Response) {
  try {
    const { name, password, role, status } = req.body;

    if (!name || !password || !role) {
      return res.status(400).json({
        message: "Name, password, and role are required",
      });
    }

    const parts = name.trim().split(/\s+/);
    const firstName = parts[0];
    const lastName = parts.slice(1).join(" ");

    const username = await generateUsername(name);

    const clerkUser = await clerkClient.users.createUser({
      username,
      password,
      firstName,
      lastName,
      publicMetadata: {
        role: role.toLowerCase(),
      },
    });

    const teamMember = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        name,
        username,
        role: role.toUpperCase(),
        status: status?.toUpperCase() || "ACTIVE",
      },
    });

    return res.status(201).json(teamMember);
  } catch (error) {
    console.error("Create team member error:", error);

    return res.status(500).json({
      message: "Failed to create team member",
    });
  }
}