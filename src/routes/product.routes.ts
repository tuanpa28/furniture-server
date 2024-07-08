import { Router } from 'express';
import { productController } from '~/controllers';
import { verifyAdmin, verifyToken } from '~/middlewares';

const routerProduct: Router = Router();

// Find All
routerProduct.get('/', productController.findList);

// Find List By Category
routerProduct.get('/:slug/category', productController.findListByCategory);

// Find List By Sub Category
routerProduct.get('/:slug/sub-category', productController.findListBySubCategory);

// Find One by Id
routerProduct.get('/:id', productController.findOne);

// Find One by slug
routerProduct.get('/:slug/slug', productController.findOneBySlug);

// Find List related by slug
routerProduct.get('/:slug/related', productController.findListRelated);

// Create
routerProduct.post('/', verifyToken, verifyAdmin, productController.create);

// Update
routerProduct.put('/:id', verifyToken, verifyAdmin, productController.update);

// Delete
routerProduct.delete('/:id', verifyToken, verifyAdmin, productController.remove);

export default routerProduct;
