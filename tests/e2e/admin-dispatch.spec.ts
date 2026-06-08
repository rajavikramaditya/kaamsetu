import { test, expect } from "@playwright/test";

test.describe("admin dispatch", () => {
  test.skip("admin dashboard loads", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await expect(page.getByRole("heading", { name: /Dashboard/i })).toBeVisible();
  });
});
