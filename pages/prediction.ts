import { Page, Locator } from '@playwright/test';

export default class PredictionPage {
  page: Page;
  readonly monitor_tab: Locator;
  readonly ask_ai: Locator;
  readonly predict_button: Locator;
  readonly img_url: Locator;
  readonly img_url_field: Locator;
  readonly submit_button: Locator;
  readonly confidence_button: Locator;
  readonly close_button: Locator;
  readonly select_label: Locator;
  readonly click_apply: Locator;
  readonly predicted_column: Locator;
  readonly model_text: Locator;
  readonly model_deployed: Locator;
  readonly range_query: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monitor_tab = page.getByRole("tab", { name: "Monitor" });
    this.ask_ai = page.locator('#ask-ai');
    this.predict_button = page.locator('#predict-button');
    this.img_url = page.getByRole('button', { name: 'Paste an Image URL' });
    this.img_url_field = page.getByLabel('Image Link');
    this.submit_button = page.getByRole('button', { name: 'Submit' });
    this.confidence_button = page.locator('#confidence-button');
    this.close_button = page.getByRole('button', { name: 'Close' });
    this.select_label = page.locator("#select-label");
    this.click_apply = page.getByRole("button", { name: "Apply" });
    this.predicted_column = page.locator('#predicted-column');
    this.model_text = page.locator('#model-text');
    this.model_deployed = page.locator('#deployed-model-name');
    this.range_query = page.locator('#range-query');
  }

  public async monitorTab() {
    await this.monitor_tab.click();
  }

  public async clickAskAI() {
    await this.ask_ai.click();
  }

  public async clickPredict() {
    await this.predict_button.click();
  }

  public async selectRangeQuery() {
    await this.range_query.check();
  }

  public async inputRangeQueries(rangeQueryInputs: any) {
    let count = 1 ;
    for (const locator in rangeQueryInputs) {      
      const data = rangeQueryInputs[locator];
      if (data.length > 0) {
        await this.page.locator(`#select-feature-${locator}`).check();
        await this.page.locator(`(//input[@id="start"])[${count}]`).fill(String(data[0]));
        await this.page.locator(`(//input[@id="increment"])[${count}]`).fill(String(data[1]));
        await this.page.locator(`(//div[@id="count"])[${count}]`).click();
        await this.page.getByRole("option", { name: String(data[2]) }).click();        
      }
      count += 1      
    }
  }

  public async predictWithRangeQueriers(rangeQueryInputs: any) {
    await this.monitorTab();
    await this.clickAskAI();
    await this.selectRangeQuery();
    await this.inputRangeQueries(rangeQueryInputs)
    await this.clickPredict();
  }


  public async uploadImageFileToPredict(filePath: string) {
    await this.page.setInputFiles('input[type="file"]', filePath);
    await this.clickPredict();
    await this.checkConfidence();
  }

  public async pasteImageURLToPredict(link: string){
    await this.img_url.click();
    // await expect(this.page.locator('#form-dialog-title')).toHaveText('Paste an Image URL');
    // await expect(this.page.locator('#dialog-content-text')).toHaveText('Please paste a valid image url before continuing.');
    await this.img_url_field.fill(link);
    await this.submit_button.click();
    await this.page.click('body');
    await this.clickPredict();
    await this.checkConfidence();
  }

  public async checkConfidence() {
    await this.confidence_button.click();
    await this.close_button.click();
  }

  public async doPredict() {
    await this.monitorTab();
    await this.clickAskAI();
    await this.clickPredict();
  }

  public async imagePredict(filePath: string, link: string) {
    await this.monitorTab();
    await this.uploadImageFileToPredict(filePath);
    await this.pasteImageURLToPredict(link);
  }
}





