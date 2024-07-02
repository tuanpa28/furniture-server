import { Router } from 'express';
import { categoryController } from '~/controllers';

const routerCategory: Router = Router();

// Find All
routerCategory.get('/', categoryController.findList);

export default routerCategory;
