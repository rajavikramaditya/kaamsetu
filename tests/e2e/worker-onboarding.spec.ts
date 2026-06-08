import { test, expect } from "@playwright/test";

test("worker login page loads", async ({ page }) => {
  await page.goto("/worker/login");
  await expect(page.getByRole("heading", { name: /Worker Login/i })).toBeVisible();
});
