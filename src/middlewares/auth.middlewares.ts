import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { badRequest } from '~/constants/httpStatus';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization) {
    const accessToken = req.headers.authorization.split(' ')[1];
    jwt.verify(accessToken, process.env.SECRET_KEY_JWT as string, (error, user) => {
      if (error) {
        return res.status(401).json(badRequest(401, 'Token is not valid!'));
      }
      // req.user = user;
      next();
    });
  } else {
    res.status(401).json(badRequest(401, "You're not authenticated!"));
  }
};

export const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
  // const user = req.user;
  // if (user) {
  //   // if (!(user.isAdmin === true)) {
  //   //   return res.status(401).json(badRequest(401, "You're not authorization!"));
  //   // }
  //   next();
  // } else {
  //   res.status(401).json(badRequest(401, "You're not authenticated!"));
  // }
};
