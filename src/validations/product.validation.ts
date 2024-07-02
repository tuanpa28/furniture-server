import Joi from 'joi';

export const productSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'name không được để trống!',
    'any.required': 'Trường name là bắt buộc!',
  }),
  images: Joi.array(),
  description: Joi.string(),
  subCategoryId: Joi.string().required(),
});
