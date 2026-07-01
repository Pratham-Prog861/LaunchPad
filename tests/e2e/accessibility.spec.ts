import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { hasClerkE2EConfig } from "./helpers/authEnv";

test.describe("Accessibility", () => {
  test.skip(!hasClerkE2EConfig, "Clerk env vars not configured with real values");
  test("Sign-in page should not have any automatically detectable WCAG violations", async ({
    page,
  }) => {
    await page.goto("/sign-in");
    await page.waitForSelector(".cl-rootBox", { state: "visible" });

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Sign-up page accessibility check", async ({ page }) => {
    await page.goto("/sign-up");
    await page.waitForSelector(".cl-rootBox", { state: "visible" });
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
