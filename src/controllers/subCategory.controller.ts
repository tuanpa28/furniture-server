import { Request, Response } from 'express';
import { badRequest, serverError, successfully } from '~/constants/httpStatus';
import Category from '~/models/Category';
import { subCategoryService } from '~/services';
import { subCategorySchema } from '~/validations/subCategory.validation';

export const findList = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, _sort = 'createdAt', _order = 'asc', ...params } = req.query;

    const options = {
      skip: (Number(page) - 1) * Number(limit),
      limit: Number(limit),
      sort: {
        [String(_sort)]: _order === 'desc' ? -1 : 1,
      },
      ...params,
    };

    const [subCategories, count] = await Promise.all([
      subCategoryService.findAll(options),
      subCategoryService.countDocuments(),
    ]);

    res.status(200).json(
      successfully(
        {
          data: subCategories,
          currentPage: Number(page),
          totalPage: Math.ceil(count / Number(limit)),
          totalDocs: count,
        },
        'Lấy dữ liệu thành công!',
      ),
    );
  } catch (error: any) {
    res.status(500).json(serverError(error?.message));
  }
};

export const findOne = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const subCategory = await subCategoryService.findOne(id);

    if (!subCategory) {
      return res.status(400).json(badRequest(400, 'Không có dữ liệu!'));
    }

    res.status(200).json(successfully(subCategory, 'Lấy dữ liệu thành công!'));
  } catch (error: any) {
    res.status(500).json(serverError(error?.message));
  }
};

export const findOneBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const subCategory = await subCategoryService.findOneOptions({
      field: 'slug',
      payload: slug,
    });

    if (!subCategory) {
      return res.status(400).json(badRequest(400, 'Không có dữ liệu!'));
    }

    res.status(200).json(successfully(subCategory, 'Lấy dữ liệu thành công!'));
  } catch (error: any) {
    res.status(500).json(serverError(error?.message));
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const { error } = subCategorySchema.validate(req.body);

    if (error) {
      return res.status(400).json(badRequest(400, error.details[0].message));
    }

    const subCategory = await subCategoryService.create(req.body);

    if (!subCategory) {
      return res.status(400).json(badRequest(400, 'Thêm dữ liệu thất bại!'));
    }

    await Category.findByIdAndUpdate(subCategory.categoryId, {
      $addToSet: { subCategories: subCategory._id },
    });

    res.status(200).json(successfully(subCategory, 'Thêm dữ liệu thành công!'));
  } catch (error: any) {
    res.status(500).json(serverError(error?.message));
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = subCategorySchema.validate(req.body);

    if (error) {
      return res.status(400).json(badRequest(400, error.details[0].message));
    }

    const subCategory = await subCategoryService.update(id, req.body);

    if (!subCategory) {
      return res.status(400).json(badRequest(400, 'Sửa dữ liệu thất bại!'));
    }

    await Promise.all([
      Category.findByIdAndUpdate(subCategory?.categoryId, {
        $pull: { subCategories: subCategory?._id },
      }),
      Category.findByIdAndUpdate(req.body.categoryId, {
        $addToSet: { subCategories: subCategory?._id },
      }),
    ]);

    res.status(200).json(successfully(subCategory, 'Sửa dữ liệu thành công!'));
  } catch (error: any) {
    res.status(500).json(serverError(error?.message));
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const subCategory = await subCategoryService.remove(id);

    if (!subCategory) {
      return res.status(400).json(badRequest(400, 'Xóa dữ liệu thất bại!'));
    }

    await Category.findByIdAndUpdate(subCategory?.categoryId, {
      $pull: { subCategories: subCategory?._id },
    });

    res.status(200).json(successfully(subCategory, 'Xóa dữ liệu thành công!'));
  } catch (error: any) {
    res.status(500).json(serverError(error?.message));
  }
};
