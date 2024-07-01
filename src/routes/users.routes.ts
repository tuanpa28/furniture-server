import { Router } from 'express';
import { usersController } from '~/controllers';
import { verifyToken, verifyAdmin } from '~/middlewares';

const routerUser: Router = Router();

// Find All
routerUser.get('/', verifyToken, verifyAdmin, usersController.findList);

export default routerUser;
