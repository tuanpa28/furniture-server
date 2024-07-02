import Joi from 'joi';

export const registerSchema = Joi.object({
  username: Joi.string().required().min(3).max(30).messages({
    'string.min': 'username phải có ít nhất {#limit} ký tự!',
    'string.max': 'username tối đa {#limit} ký tự!',
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
});

export const loginSchema = Joi.object({
  emailOrUsername: Joi.string().required().messages({
    'string.empty': 'emailOrUsername không được để trống!',
    'any.required': 'Trường emailOrUsername là bắt buộc!',
  }),
  password: Joi.string().required().min(6).messages({
    'string.min': 'password phải có ít nhất {#limit} ký tự!',
    'string.empty': 'password không được để trống!',
    'any.required': 'Trường password là bắt buộc!',
  }),
});
