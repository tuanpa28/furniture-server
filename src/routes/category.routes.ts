import { Router } from 'express';
import { categoryController } from '~/controllers';
import { verifyAdmin, verifyToken } from '~/middlewares';

const routerCategory: Router = Router();

// Find All
routerCategory.get('/', categoryController.findList);

// Find One by Id
routerCategory.get('/:id', categoryController.findOne);

// Find One by slug
routerCategory.get('/:slug/slug', categoryController.findOneBySlug);

// Create
routerCategory.post('/', verifyToken, verifyAdmin, categoryController.create);

// Update
routerCategory.put('/:id', verifyToken, verifyAdmin, categoryController.update);

// Delete
routerCategory.delete('/:id', verifyToken, verifyAdmin, categoryController.remove);

export default routerCategory;
