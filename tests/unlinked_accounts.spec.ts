import { expect } from '@playwright/test';
import { test } from "../fixtures/basePage";
import tests from '../test-data/unlinked.json';


test.describe('Unlinked', () => {
  for (const testCase of tests.tests) {
    test(`${testCase.name} Test`, async ({ page, createAiService, datasetPage, featureEngineeringPage, training, predictionPage, retrainPage, serviceAction }) => {

      await page.goto("/");
      //Create AI Service Page
      const uniquename = await createAiService.createname(testCase.name);
      await createAiService.createaiservice(uniquename);
      await expect(createAiService.create_ai_title).toHaveText('Create AI Service');
      await expect(createAiService.naming_ai).toContainText('Please name your AI service before continuing.');

      //Dataset Page
      await datasetPage.uploadCSVDataset(testCase.file);
      await expect(datasetPage.dataset_upload_success).toContainText('Successfully imported dataset!');

      //Feature Engineering Page
      await featureEngineeringPage.runFe('SKlearn Serverless', 'CSV', 'Automatic', testCase.label);
      expect(await (featureEngineeringPage.fe_complete_text).textContent()).toBe('Dataset analysis and feature engineering is complete.');
      await expect(featureEngineeringPage.fe_pass).toHaveText('Passed');
      await expect(featureEngineeringPage.prediction_label_text).toHaveText('Prediction Label:');

      //Rerun Feature Engineering Page
      await featureEngineeringPage.reRunFe('CSV', testCase.problem_type);
      await page.waitForSelector('button#apply-button:not([disabled])');
      expect(await (featureEngineeringPage.fe_complete_text).textContent()).toBe('Dataset analysis and feature engineering is complete.');
      await expect(featureEngineeringPage.fe_pass).toHaveText('Passed');
      await expect(featureEngineeringPage.prediction_label_text).toHaveText('Prediction Label:');

      // Training Page
      await training.trainSklearnAutomatic();
      expect(await (training.deploy_success_text).textContent()).toBe('Navigator has successfully deployed ');
      expect(await page.isVisible('#project-publish-tab')).toBe(true);

      //Prediction Page
      await predictionPage.doPredict();
      await expect(predictionPage.predicted_column).toContainText(`Predictions were made on the column: ${testCase.label}`);
      await expect(predictionPage.model_text).toContainText('Model:');

      if (testCase.semiAutoAlgorithm) {
        const semiAutomaticInputs = testCase.semiAutoAlgorithm;
        await training.trainSklearnSemiAutomatic(semiAutomaticInputs.model, semiAutomaticInputs.parameters);
        expect(await (training.deploy_success_text).textContent()).toBe('Navigator has successfully deployed ');
        await expect(predictionPage.model_deployed).toHaveText(semiAutomaticInputs.model);
      }

      if (testCase.rangeQueryInputs) {
        const rangeQueryInputs = testCase.rangeQueryInputs;
        await predictionPage.predictWithRangeQueriers(rangeQueryInputs);
      }
      else {
        await predictionPage.doPredict();
      }

      await expect(predictionPage.predicted_column).toContainText(`Predictions were made on the column: ${testCase.label}`);
      await expect(predictionPage.model_text).toContainText('Model:');

      // Retrain
      if (testCase.reTrain) {
        await retrainPage.doRetrain(testCase.reTrain);
        await retrainPage.prediction.click();
      }


      // Service Action
      await serviceAction.deleteAIService(uniquename);
    });

  }
});