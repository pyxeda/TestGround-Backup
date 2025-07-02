import { Page, Locator } from '@playwright/test';

export default class RetrainPage {
  page: Page;
  readonly retrain_tab: Locator;
  readonly predict_button: Locator;
  readonly prediction_wrong_btn: Locator;
  readonly input_correction: Locator;
  readonly submit_button: Locator;
  readonly heading1: Locator;
  readonly heading2: Locator;
  readonly retrain: Locator;
  readonly prediction: Locator;

  constructor(page: Page) {
    this.page = page;
    this.retrain_tab = page.getByRole('tab', { name: 'Retrain' });
    this.predict_button = page.locator('#predict-button');
    this.prediction_wrong_btn = page.locator('#prediction-wrong-button');
    this.input_correction = page.locator('#input-correct-prediction');
    this.submit_button = page.locator('#submit');
    this.heading1 = page.getByRole('heading', { name: 'Thanks! I will try to remember this the next time I retrain' })
    this.heading2 = page.getByRole('heading', { name: 'Retrain has successfully completed!' });
    this.retrain = page.locator('#retrain-button');
    this.prediction = page.locator('#prediction');
  }

  public async retrainTab() {
    await this.retrain_tab.click();
  }

  public async clickPredict() {
    await this.predict_button.click();
  }

  public async changePrediction(correct_predict: string){
    await this.prediction_wrong_btn.click();
    await this.input_correction.fill(correct_predict);
    await this.submit_button.click();        
    await this.heading1.click();
  }

  public async clickRetrain(){
    await this.retrain.click();        
    await this.heading2.click();
  }

  public async doRetrain(correct_predict: string) {
    await this.retrainTab();
    await this.clickPredict();
    await this.changePrediction(correct_predict);
    await this.clickRetrain();
    await this.clickPredict();
  }

}




