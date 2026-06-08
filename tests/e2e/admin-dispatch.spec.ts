import { test, expect } from "@playwright/test";

test("admin dashboard page loads", async ({ page }) => {
  await page.goto("/admin/dashboard");
  await expect(page.getByRole("heading", { name: /Admin Dashboard/i })).toBeVisible();
});
