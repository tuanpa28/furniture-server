import { Router } from 'express';
import { subCategoryController } from '~/controllers';

const routerSubCategory: Router = Router();

// Find All
routerSubCategory.get('/', subCategoryController.findList);

export default routerSubCategory;
