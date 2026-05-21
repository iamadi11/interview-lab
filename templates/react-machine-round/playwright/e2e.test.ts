import { test, expect } from "@playwright/test";

test.describe("React Machine Round — smoke tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3100");
  });

  test("renders the page title", async ({ page }) => {
    await expect(page.getByText("React Machine Round")).toBeVisible();
  });

  test("can add a todo", async ({ page }) => {
    const input = page.getByPlaceholder("Add todo…");
    await input.fill("Write a virtual list");
    await page.keyboard.press("Enter");
    await expect(page.getByText("Write a virtual list")).toBeVisible();
  });

  test("can toggle a todo", async ({ page }) => {
    const input = page.getByPlaceholder("Add todo…");
    await input.fill("Test toggle");
    await page.keyboard.press("Enter");
    const checkbox = page.locator("input[type=checkbox]").first();
    await checkbox.check();
    await expect(checkbox).toBeChecked();
  });

  test("timer starts and shows warmup phase", async ({ page }) => {
    await page.getByRole("button", { name: "Start" }).click();
    await expect(page.getByText(/warmup/i)).toBeVisible();
  });

  test("users section renders a list", async ({ page }) => {
    await expect(page.getByText("Users — React Query + MSW")).toBeVisible();
    // Wait for MSW to respond
    await expect(page.locator("img").first()).toBeVisible({ timeout: 5000 });
  });
});
