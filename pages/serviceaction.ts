import { Page, Locator } from '@playwright/test';

export default class ServiceAction {
  page: Page;
  readonly ai_services: Locator;
  readonly click_delete: Locator;


  constructor(page: Page) {
    this.page = page;
    this.ai_services = page.getByRole('button', { name: 'AI Services' });
    this.click_delete = page.locator('//span[text()="Delete"]');
  }

  public async gotoAIServices(){
    await this.ai_services.click();
  }

  public async selectAIService(AIName: string){
    await this.ai_services.click();
    await this.page.getByRole('link', { name: AIName }).click();
  }

  public async deleteAIService(uniquename: string) {
    await this.gotoAIServices();
    await this.page.locator(`#delete-${uniquename}`).click();
    await this.click_delete.click();
  }
}





