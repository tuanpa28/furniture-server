import { Application } from 'express';
import routerUser from './users.routes';

export default function routes(app: Application) {
  app.use('/api/users', routerUser);
}
