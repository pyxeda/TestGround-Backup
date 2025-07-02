import { Page, Locator } from '@playwright/test';

export default class FeatureEngineeringPage {
  page: Page;
  readonly fe_tab: Locator;
  readonly select_engine: Locator;
  readonly sklearn: Locator;
  readonly dask: Locator;
  readonly select_problem_type: Locator;
  readonly automatic: Locator;
  readonly classification: Locator;
  readonly regression: Locator;
  readonly select_label: Locator;
  readonly click_apply: Locator;
  readonly fe_complete_text: Locator;
  readonly fe_pass: Locator;
  readonly prediction_label_text: Locator;


  constructor(page: Page) {
    this.page = page;
    this.fe_tab = page.getByRole("tab", { name: "Feature Engineering" });
    this.select_engine = page.locator('#select-fe-engine');
    this.sklearn = page.locator('#sklearn-serverless');
    this.dask = page.locator('#dask-distributed');
    this.select_problem_type = page.locator('#select-problem-type'); 
    this.automatic = page.locator('#automatic');
    this.classification = page.locator('#classification');
    this.regression = page.locator('#regression');
    this.select_label = page.locator("#select-label");
    this.click_apply = page.locator("button#apply-button");
    this.fe_complete_text = page.locator('#fe-completed-text');
    this.fe_pass = page.locator('#passed');
    this.prediction_label_text = page.locator('#prediction-label-text');
  }

  public async navigateToFe() {
    await this.fe_tab.click();
  }

  public async selectEngine(engine: string) {
    await this.select_engine.click();
    await this.page.getByRole("option", { name: engine }).click();
  }

  public async engineType(engine: string) {
    if (engine === "Sklearn") {
      await this.sklearn.click();
    } else if (engine === "Dask") {
      await this.dask.click();;
    }
  }

  public async selectProblemType() {
    await this.select_problem_type.click();
  }

  public async problemType(problem_type?: string) {
    if (problem_type === "Automatic") {
      await this.automatic.click();
    } else if (problem_type === "Regression") {
      await this.regression.click();
    } else if (problem_type === "Classification") {
      await this.classification.click();
    }
  }

  public async selectLabel(label?: string) {
    await this.select_label.click();
    if (label !== undefined) {
      await this.page.getByRole("option", { name: label }).click();
    }
  }

  public async clickApply() {
    await this.click_apply.click();
  }

  public async runFe(engineType: string, type?: string, problemType?: string, label?: string) {
    await this.navigateToFe();
    if (type === 'CSV') {
      await this.selectEngine(engineType);
      await this.engineType(engineType);
      await this.selectProblemType();
      await this.problemType(problemType);
      await this.selectLabel(label);      
      await this.clickApply( );
    }
    else {
      await this.clickApply();
    }

  }

  public async reRunFe(type?: string, problemType?: string){
    await this.navigateToFe();
    if (type === 'CSV') {
      await this.selectProblemType();
      await this.problemType(problemType);
      await this.clickApply( );
    }
    else {
      await this.clickApply( );
    }
  }


}






