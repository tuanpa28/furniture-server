import jwt from 'jsonwebtoken';

export const generateToken = (payload: any, expiresIn = '1h') => {
  const token = jwt.sign(payload, process.env.SECRET_KEY_JWT as string, {
    expiresIn,
  });
  return token;
};
