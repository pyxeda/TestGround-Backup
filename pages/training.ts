import { Page, Locator } from '@playwright/test';

export default class Training {
  page: Page;
  readonly train_tab: Locator;
  readonly select_sagemaker: Locator;
  readonly select_automatic: Locator;
  readonly select_semi_automatic: Locator;
  readonly train_button: Locator;
  readonly deploy_button: Locator;
  readonly deploy_success_text: Locator;

  constructor(page: Page) {
    this.page = page;
    this.train_tab = page.locator('#train-tab');
    this.select_sagemaker = page.locator('#train-switch');
    this.select_automatic = page.locator('#automatic-radio');
    this.select_semi_automatic = page.locator('#semi-automatic-radio');
    this.train_button = page.locator('#train-button'); 
    this.deploy_button = page.locator('#current-model-deploy-button');
    this.deploy_success_text = page.locator('#deploy-success-text');
  }

  public async trainTab() {
    await this.train_tab.click();
  }

  public async clickSagemaker() {
    await this.select_sagemaker.click();
  }

  public async selectAutomatic() {
    await this.select_automatic.click();
  }

  public async selectSemiAutomatic() {
    await this.select_semi_automatic.click();
  }

  public async selectModel(model: string) {
    const model_select = await this.page.waitForSelector(`#${model}`)
    await model_select.click();
  }

  public async clickTrain() {
    await this.train_button.click();
  }

  public async clickDeploy() {
    await this.deploy_button.click();
  }

  public async trainSklearnAutomatic() {
    await this.trainTab();
    await this.selectAutomatic();
    await this.clickTrain();
  }

  public async trainTensorflowAutomatic() {
    await this.trainTab();
    await this.selectAutomatic();
    await this.clickTrain();
  }

  public async trainSklearnSemiAutomatic(model: string, parameters: object) {
    await this.trainTab();
    await this.selectSemiAutomatic();
    await this.selectModel(model);
    if (parameters) {
      for (const [locator, data] of Object.entries(parameters)) {
        await this.page.locator(`#${locator}`).fill(data as string);
      } 
  }
    await this.clickTrain();
    await this.clickDeploy()
  }

  public async trainTensorflowSemiAutomatic(model: string) {
    await this.trainTab();
    await this.selectSemiAutomatic();
    await this.selectModel(model)
    await this.clickTrain();
    await this.clickDeploy()
  }

}




