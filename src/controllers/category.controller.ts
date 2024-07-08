import { Request, Response } from 'express';
import { badRequest, serverError, successfully } from '~/constants/httpStatus';
import { categoryService } from '~/services';
import { categorySchema } from '~/validations/category.validation';

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

    const [categories, count] = await Promise.all([categoryService.findAll(options), categoryService.countDocuments()]);

    res.status(200).json(
      successfully(
        {
          data: categories,
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
    const category = await categoryService.findOne(id);

    if (!category) {
      return res.status(400).json(badRequest(400, 'Không có dữ liệu!'));
    }

    res.status(200).json(successfully(category, 'Lấy dữ liệu thành công!'));
  } catch (error: any) {
    res.status(500).json(serverError(error?.message));
  }
};

export const findOneBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const category = await categoryService.findOneOptions({
      field: 'slug',
      payload: slug,
    });

    if (!category) {
      return res.status(400).json(badRequest(400, 'Không có dữ liệu!'));
    }

    res.status(200).json(successfully(category, 'Lấy dữ liệu thành công!'));
  } catch (error: any) {
    res.status(500).json(serverError(error?.message));
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const { error } = categorySchema.validate(req.body);

    if (error) {
      return res.status(400).json(badRequest(400, error.details[0].message));
    }

    const category = await categoryService.create(req.body);

    if (!category) {
      return res.status(400).json(badRequest(400, 'Thêm dữ liệu thất bại!'));
    }

    res.status(200).json(successfully(category, 'Thêm dữ liệu thành công!'));
  } catch (error: any) {
    res.status(500).json(serverError(error?.message));
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = categorySchema.validate(req.body);

    if (error) {
      return res.status(400).json(badRequest(400, error.details[0].message));
    }

    const category = await categoryService.update(id, req.body);

    if (!category) {
      return res.status(400).json(badRequest(400, 'Sửa dữ liệu thất bại!'));
    }

    res.status(200).json(successfully(category, 'Sửa dữ liệu thành công!'));
  } catch (error: any) {
    res.status(500).json(serverError(error?.message));
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await categoryService.remove(id);

    if (!category) {
      return res.status(400).json(badRequest(400, 'Xóa dữ liệu thất bại!'));
    }

    res.status(200).json(successfully(category, 'Xóa dữ liệu thành công!'));
  } catch (error: any) {
    res.status(500).json(serverError(error?.message));
  }
};
