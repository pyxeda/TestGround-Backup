import { test as base } from "@playwright/test";
import CreateAIService from "../pages/create_ai";
import DatasetPage from "../pages/dataset";
import FeatureEngineeringPage from "../pages/feature_engineering";
import Training from "../pages/training";
import PredictionPage from "../pages/prediction";
import RetrainPage from "../pages/retrain";
import ServiceAction from "..//pages/serviceaction";

export const test = base.extend<{
    createAiService: CreateAIService;
    datasetPage: DatasetPage;
    featureEngineeringPage: FeatureEngineeringPage;
    training: Training;
    predictionPage: PredictionPage;
    retrainPage: RetrainPage;
    serviceAction: ServiceAction
}>(
    {
        //Define a fixture
        createAiService: async ({ page }, use) => {
            await use(new CreateAIService(page));
        },
        datasetPage: async ({ page }, use) => {
            await use(new DatasetPage(page));
        },
        featureEngineeringPage: async ({ page }, use) => {
            await use(new FeatureEngineeringPage(page));
        },
        training: async ({ page }, use) => {
            await use(new Training(page));
        },
        predictionPage: async ({ page }, use) => {
            await use(new PredictionPage(page));
        },
        retrainPage: async ({ page }, use) => {
            await use(new RetrainPage(page));
        },
        serviceAction: async ({ page }, use) => {
            await use(new ServiceAction(page));
        },
    });
