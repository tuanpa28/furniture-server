import { Router } from 'express';
import { productController } from '~/controllers';

const routerProduct: Router = Router();

// Find All
routerProduct.get('/', productController.findList);

export default routerProduct;
