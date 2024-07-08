import { Router } from 'express';
import { userController } from '~/controllers';
import { verifyToken, verifyAdmin } from '~/middlewares';

const routerUser: Router = Router();

// Find All
routerUser.get('/', verifyToken, verifyAdmin, userController.findList);

// Find One By Id
routerUser.get('/:id', userController.findOne);

// Find One By User Name
routerUser.get('/:username/username', userController.findOneByUserName);

// Update
routerUser.put('/:id', verifyToken, userController.update);

// Delete
routerUser.delete('/:id', verifyToken, verifyAdmin, userController.remove);

export default routerUser;
