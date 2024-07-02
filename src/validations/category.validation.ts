import Joi from 'joi';

export const categorySchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'name không được để trống!',
    'any.required': 'Trường name là bắt buộc!',
  }),
});
