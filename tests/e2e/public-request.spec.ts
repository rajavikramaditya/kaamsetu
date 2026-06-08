import { test, expect } from "@playwright/test";

test.describe("public pages", () => {
  test("home page loads", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "KaamSetu" })).toBeVisible();
  });

  test("health endpoint returns ok", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.status).toBe("ok");
  });
});
