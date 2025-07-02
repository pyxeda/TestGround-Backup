import { expect } from '@playwright/test';
import { test } from "../fixtures/basePage";
import tests from '../test-data/image_test.json';


test.describe('Images', () => {
  for (const testCase of tests.tests) {
    test(`${testCase.name} Test`, async ({ page, createAiService, datasetPage, featureEngineeringPage, training, predictionPage, serviceAction }) => {

      await page.goto("/");
     
      //Create AI Service Page
      const uniquename = await createAiService.createname(testCase.name);
      await createAiService.createaiservice(uniquename);
      await expect(createAiService.create_ai_title).toHaveText('Create AI Service');
      await expect(createAiService.naming_ai).toContainText('Please name your AI service before continuing.');

      //Dataset Page
      await datasetPage.uploadImageDataset(uniquename, testCase.categories, testCase.data_folder_name);
      expect(await (datasetPage.dataset_upload_success).textContent()).toBe('Successfully imported dataset!');

      //Feature Engineering Page
      await featureEngineeringPage.runFe('Image');
      expect(await (featureEngineeringPage.fe_complete_text).textContent()).toBe('Dataset analysis and feature engineering is complete.');
      await expect(featureEngineeringPage.fe_pass).toHaveText('Passed');
      
      // Training Page
      await training.trainSklearnAutomatic();
      expect(await (training.deploy_success_text).textContent()).toBe('Navigator has successfully deployed ');
      expect(await page.isVisible('#project-publish-tab')).toBe(true);

      //Prediction Page
      await predictionPage.imagePredict(testCase.filePath, testCase.link);
      await expect(predictionPage.model_text).toContainText('Model:');

      //Semi-Automatic Training  
      if (testCase.semiAutoAlgorithm) {
        const semiAutomaticInputs = testCase.semiAutoAlgorithm;
        await training.trainSklearnSemiAutomatic(semiAutomaticInputs.model, semiAutomaticInputs.parameters);
        expect(await (training.deploy_success_text).textContent()).toBe('Navigator has successfully deployed ');
        await expect(predictionPage.model_deployed).toHaveText('MobileNetV2');
        expect(await page.isVisible('#project-publish-tab')).toBe(true);
      }

      //Prediction Page
      await predictionPage.imagePredict(testCase.filePath, testCase.link); 
      await expect(predictionPage.model_text).toContainText('Model:');     
      
      // Service Action
      await serviceAction.deleteAIService(uniquename);
    });
  }
});