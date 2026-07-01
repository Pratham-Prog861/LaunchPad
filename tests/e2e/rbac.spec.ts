import { test, expect } from "@playwright/test";

test.describe("RBAC Permissions and Constraints", () => {
  test("Unauthenticated requests to list drafts are blocked with 401 Unauthorized", async ({
    request,
  }) => {
    const res = await request.get("/api/drafts");
    expect(res.status()).toBe(401);
  });

  test("Unauthenticated requests to releases list are blocked with 401 Unauthorized", async ({
    request,
  }) => {
    const res = await request.get("/api/releases/architecture-2024");
    expect(res.status()).toBe(401);
  });

  test("Unauthenticated requests to activities list are blocked with 401 Unauthorized", async ({
    request,
  }) => {
    const res = await request.get("/api/activities");
    expect(res.status()).toBe(401);
  });
});
