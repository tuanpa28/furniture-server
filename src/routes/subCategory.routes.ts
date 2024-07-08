import { Router } from 'express';
import { subCategoryController } from '~/controllers';
import { verifyAdmin, verifyToken } from '~/middlewares';

const routerSubCategory: Router = Router();

// Find All
routerSubCategory.get('/', subCategoryController.findList);

// Find One by Id
routerSubCategory.get('/:id', subCategoryController.findOne);

// Find One by slug
routerSubCategory.get('/:slug/slug', subCategoryController.findOneBySlug);

// Create
routerSubCategory.post('/', verifyToken, verifyAdmin, subCategoryController.create);

// Update
routerSubCategory.put('/:id', verifyToken, verifyAdmin, subCategoryController.update);

// Delete
routerSubCategory.delete('/:id', verifyToken, verifyAdmin, subCategoryController.remove);

export default routerSubCategory;
