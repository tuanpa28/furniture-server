import { Router } from 'express';
import { userController } from '~/controllers';
import { verifyToken, verifyAdmin } from '~/middlewares';

const routerUser: Router = Router();

// Find All
routerUser.get('/', verifyToken, verifyAdmin, userController.findList);

export default routerUser;
