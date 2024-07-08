import Joi from 'joi';

export const userSchema = Joi.object({
  username: Joi.string().min(3).max(30).messages({
    'string.min': 'username phải có ít nhất {#limit} ký tự!',
    'string.max': 'username tối đa {#limit} ký tự!',
  }),
  email: Joi.string().email().messages({
    'string.empty': 'email không được để trống!',
    'string.email': 'email không đúng định dạng!',
  }),
  password: Joi.string().min(6).messages({
    'string.min': 'password phải có ít nhất {#limit} ký tự!',
  }),
  role: Joi.string(),
});
