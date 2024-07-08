import { Router } from 'express';
import { authController } from '~/controllers';

const routerAuth: Router = Router();

// Login
routerAuth.post('/login', authController.login);

// Register
routerAuth.post('/register', authController.register);

export default routerAuth;
