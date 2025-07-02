import { test as setup } from "@playwright/test";
import credentials from "../credentials.json";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Username / Email").fill(credentials.username);
  await page.getByLabel("Password").fill(credentials.password);
  await page.getByRole("button", { name: "Login" }).click();

  await page.waitForURL("/");

  await page.context().storageState({ path: authFile });
});
