import jwt from 'jsonwebtoken';

export const generateToken = (payload: string, expiresIn = '10m') => {
  const token = jwt.sign(payload, process.env.SECRET_KEY_JWT as string, {
    expiresIn,
  });
  return token;
};
