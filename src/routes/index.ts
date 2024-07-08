import { Application } from 'express';
import routerAuth from './auth.routes';
import routerCategory from './category.routes';
import routerProduct from './product.routes';
import routerSubCategory from './subCategory.routes';
import routerUser from './user.routes';
import routerUpload from './upload.routes';

export default function routes(app: Application) {
  app.use('/api/auth', routerAuth);
  app.use('/api/user', routerUser);
  app.use('/api/category', routerCategory);
  app.use('/api/product', routerProduct);
  app.use('/api/sub-category', routerSubCategory);
  app.use('/api/upload', routerUpload);
}
