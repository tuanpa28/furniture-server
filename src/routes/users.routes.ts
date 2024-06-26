import express, { Router } from 'express';
import { usersController } from '~/controllers';
import { verifyToken } from '~/middlewares';

const routerUser: Router = express.Router();

// Find All
routerUser.get('/', verifyToken, usersController.findList);

export default routerUser;
