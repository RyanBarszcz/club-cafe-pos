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
  let clerkUserId: string | null = null;

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

    clerkUserId = clerkUser.id;

    const teamMember = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        name,
        username,
        role: role.toUpperCase(),
        active: status !== "Inactive",
      },
    });

    return res.status(201).json(teamMember);
  } catch (error) {
    console.error("Create team member error:", error);

    // Rollback if table creation failed
    if (clerkUserId) {
      try {
        await clerkClient.users.deleteUser(clerkUserId);
        console.log("Rolled back Clerk user:", clerkUserId);
      } catch (rollbackError) {
        console.error("Failed to rollback Clerk user:", rollbackError);
      }
    }

    return res.status(500).json({
      message: "Failed to create team member",
    });
  }
}

export async function getTeamMembers(req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error("Get team members error:", error);

    return res.status(500).json({
      message: "Failed to get team members",
    });
  }
}

export async function updateTeamMember(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, role, active } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({
        message: "Team member not found",
      });
    }

    const parts = name?.trim().split(/\s+/) ?? [];
    const firstName = parts[0];
    const lastName = parts.slice(1).join(" ");

    if (name || role) {
      await clerkClient.users.updateUser(existingUser.clerkId, {
        ...(name && {
          firstName,
          lastName,
        }),
        ...(role && {
          publicMetadata: {
            role: role.toLowerCase(),
          },
        }),
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(role && { role: role.toUpperCase() }),
        ...(typeof active === "boolean" && { active }),
      },
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update team member error:", error);

    return res.status(500).json({
      message: "Failed to update team member",
    });
  }
}

export async function deleteTeamMember(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({
        message: "Team member not found",
      });
    }

    await clerkClient.users.updateUser(existingUser.clerkId, {
      publicMetadata: {
        role: existingUser.role.toLowerCase(),
        inactive: true,
      },
    });

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        active: false,
      },
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Delete team member error:", error);

    return res.status(500).json({
      message: "Failed to deactivate team member",
    });
  }
}