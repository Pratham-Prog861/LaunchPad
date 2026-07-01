import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { hasRole, type Role } from "./rbac";

export function withRbac<T>(
  handler: (req: NextRequest, context: T) => Promise<Response> | Response,
  options: { requiredRole: Role }
) {
  return async (req: NextRequest, context: T) => {
    const authObj = await auth();
    if (!authObj.userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const hasAccess = await hasRole(options.requiredRole);
    if (!hasAccess) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    return handler(req, context);
  };
}
