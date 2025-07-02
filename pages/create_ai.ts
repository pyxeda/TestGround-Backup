import { Locator, Page } from '@playwright/test';
import { get_unique_ai_service_name } from '../tests/naming';


export default class CreateAIService {
  readonly page: Page;
  readonly heading: Locator;
  readonly name: Locator;
  readonly submit_button: Locator; 
  readonly create_ai_title: Locator;
  readonly naming_ai: Locator; 

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "Create an AI Service." });
    this.name = page.getByLabel("Name");
    this.submit_button = page.getByRole("button", { name: "Submit" });
    this.create_ai_title = page.locator('#form-dialog-title');
    this.naming_ai = page.locator('#dialog-content-text');

  }

  public async createname(name: string): Promise<string> {
    const uniquename = name + await get_unique_ai_service_name();
    return uniquename;
  }

  public async createaiservice(uniquename: string): Promise<void> {
    await this.heading.click();
    await this.name.fill(uniquename);
    await this.submit_button.click();
  }
}
