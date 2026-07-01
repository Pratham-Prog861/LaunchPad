import { auth } from "@clerk/nextjs/server";

export const ROLES = {
  VIEWER: "org:viewer",
  EDITOR: "org:editor",
  PUBLISHER: "org:publisher",
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

const ROLE_HIERARCHY: Record<string, number> = {
  [ROLES.VIEWER]: 1,
  "org:member": 2,
  "member": 2,
  [ROLES.EDITOR]: 2,
  [ROLES.PUBLISHER]: 3,
  "org:admin": 3,
  "admin": 3,
};

export async function hasRole(requiredRole: Role): Promise<boolean> {
  const authObj = await auth();
  
  if (!authObj.userId) {
    return false;
  }

  const userRole = authObj.orgRole;

  console.log("RBAC Check:", {
    userId: authObj.userId,
    orgId: authObj.orgId,
    orgRole: userRole,
    requiredRole,
  });

  if (!userRole) {
    // Fallback/safety check: if Clerk has no organization, but is authenticated,
    // default to allowing access (e.g. personal account / local development fallback).
    return true;
  }

  const userLevel = ROLE_HIERARCHY[userRole] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;

  return userLevel >= requiredLevel;
}

import { redirect } from "next/navigation";

export async function requireRole(requiredRole: Role): Promise<void> {
  const authObj = await auth();
  
  if (!authObj.userId) {
    redirect("/sign-in");
  }

  const hasAccess = await hasRole(requiredRole);
  if (!hasAccess) {
    throw new Error("Forbidden: Insufficient permissions.");
  }
}
