import { Locator, Page } from '@playwright/test';
import CreateAIService from './create_ai';

import * as path from 'path';
import * as fs from 'fs';

export default class DatasetPage {
  page: Page;
  createAiService: CreateAIService;
  readonly csv_radio: Locator;
  readonly img_radio: Locator;
  readonly local_radio: Locator;
  readonly s3_radio: Locator;
  readonly select_upload_location: Locator;
  readonly select_mydataset: Locator;
  readonly create_imgfolder: Locator;
  readonly create_button: Locator;
  readonly add_category_btn: Locator;
  readonly category_name: Locator;
  readonly submit_button: Locator;
  readonly dataset_upload_success: Locator;


  constructor(page: Page) {
    this.page = page;
    this.createAiService = new CreateAIService(page);
    this.csv_radio = page.locator('#csv-radio');
    this.img_radio = page.locator('#image-radio');
    this.local_radio = page.locator('#local-radio');
    this.s3_radio = page.locator('#s3-radio');
    this.select_upload_location = page.locator('#select-upload-location');
    this.select_mydataset = page.locator('#My Datasets');
    this.create_imgfolder = page.locator('#create-image-folder');
    this.create_button = page.getByRole('button', { name: 'Create' });
    this.add_category_btn = page.getByRole('button', { name: 'Add Category' });
    this.category_name = page.getByLabel('Category Name');
    this.submit_button = page.getByRole('button', { name: 'Submit' });
    this.dataset_upload_success = page.getByRole("heading", { name: "Successfully imported dataset!" });
  }

  public async selectCSV() {
    await this.csv_radio.click();
    await this.page.waitForTimeout(3000);
  }

  public async selectImage() {
    await this.img_radio.click();
    await this.page.waitForTimeout(3000);
  }

  public async selectLocal() {
    await this.local_radio.click();
  }

  public async selectS3() {
    await this.s3_radio.click();
  }

  public async getFolder() {
    await this.select_upload_location.click();
  }

  public async selectMydatasetLocal() {
    await this.select_mydataset.click();
    
  }

  public async uploadDataset(filePath: string) {
    await this.page.setInputFiles("input[type='file']", filePath);
    await this.dataset_upload_success.click();
  }

  public async createImageDataset(uniquename: string, categories: string[], folderPath: string) {
    // create image folder
    await this.create_imgfolder.fill(uniquename);
    await this.create_button.click();
    // create categories
    for (const category of categories) {
      await this.add_category_btn.click();
      await this.category_name.fill(category);
      await this.submit_button.click();
      // upload images
      const input = await this.page.locator(`input#${category}[type="file"]`);
      const CategoryPath = folderPath +`/${category}`;
      const filesToUpload = fs.readdirSync(CategoryPath).filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png'].includes(ext);
      }).map(file => path.join(CategoryPath, file));
      await input.setInputFiles(filesToUpload);
    }
  }

  public async uploadCSVDataset(filePath: string) {
    await this.selectCSV();
    await this.selectLocal();
    await this.uploadDataset(filePath);
  }

  public async uploadImageDataset(uniquename: string, categories: string[], folderPath: string) {
    await this.selectImage();
    await this.selectLocal();
    await this.createImageDataset(uniquename, categories, folderPath);
  }
}
