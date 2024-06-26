import Joi from 'joi';

export const userSchema = Joi.object({
  username: Joi.string().required().min(4).messages({
    'string.min': 'username phải có ít nhất {#limit} ký tự!',
    'string.empty': 'username không được để trống!',
    'any.required': 'Trường username là bắt buộc!',
  }),
  email: Joi.string().required().email().messages({
    'string.empty': 'email không được để trống!',
    'string.email': 'email không đúng định dạng!',
    'any.required': 'Trường email là bắt buộc!',
  }),
  password: Joi.string().required().min(6).messages({
    'string.min': 'password phải có ít nhất {#limit} ký tự!',
    'string.empty': 'password không được để trống!',
    'any.required': 'Trường password là bắt buộc!',
  }),
  isAdmin: Joi.boolean(),
});
