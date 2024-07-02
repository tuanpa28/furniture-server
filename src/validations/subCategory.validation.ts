import Joi from 'joi';

export const subCategorySchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'name không được để trống!',
    'any.required': 'Trường name là bắt buộc!',
  }),
  categoryId: Joi.string().required().messages({
    'string.empty': 'Danh mục không được để trống!',
    'any.required': 'Trường danh mục là bắt buộc!',
  }),
  products: Joi.array(),
});
