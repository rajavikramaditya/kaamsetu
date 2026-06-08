import { test, expect } from "@playwright/test";

test.describe("worker onboarding", () => {
  test.skip("worker login page loads", async ({ page }) => {
    await page.goto("/worker/login");
    await expect(page.getByRole("heading", { name: /Worker/i })).toBeVisible();
  });
});
