import { test, expect } from "@playwright/test";

test.describe("Studio Editor & API Auth Gating", () => {
  test("Redirects unauthenticated users to sign-in page", async ({
    page,
  }) => {
    await page.goto("/studio/architecture-2024");
    await page.waitForURL("**/sign-in**");
  });

  test("GET /api/drafts/[slug] returns 401 for unauthenticated calls", async ({
    request,
  }) => {
    const res = await request.get("/api/drafts/architecture-2024");
    expect(res.status()).toBe(401);
  });

  test("PUT /api/drafts/[slug] returns 401 for unauthenticated calls", async ({
    request,
  }) => {
    const res = await request.put("/api/drafts/architecture-2024", {
      data: {
        metadata: {
          slug: "architecture-2024",
          title: "New Title",
          status: "draft",
          version: "1.0.0",
        },
        sections: [],
      },
    });
    expect(res.status()).toBe(401);
  });

  test("POST /api/publish/[slug] returns 401 for unauthenticated calls", async ({
    request,
  }) => {
    const res = await request.post("/api/publish/architecture-2024", {
      data: { bumpType: "patch", releaseNotes: "Test release" },
    });
    expect(res.status()).toBe(401);
  });
});
