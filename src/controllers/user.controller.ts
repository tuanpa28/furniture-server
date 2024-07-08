import { Request, Response } from 'express';
import { badRequest, serverError, successfully } from '~/constants/httpStatus';
import { userService } from '~/services';
import { userSchema } from '~/validations/user.validation';

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

    const [users, count] = await Promise.all([userService.findAll(options), userService.countDocuments()]);

    res.status(200).json(
      successfully(
        {
          data: users,
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
    const user = await userService.findOne(id);

    if (!user) {
      return res.status(400).json(badRequest(400, 'Không có dữ liệu!'));
    }

    res.status(200).json(successfully(user, 'Lấy dữ liệu thành công!'));
  } catch (error: any) {
    res.status(500).json(serverError(error?.message));
  }
};

export const findOneByUserName = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const pipeline = [
      {
        $match: {
          username,
        },
      },
      {
        $project: {
          _id: 1,
          username: 1,
          email: 1,
          createdAt: 1,
        },
      },
    ];

    const user = await userService.findAggregate(pipeline);

    if (!user) {
      return res.status(400).json(badRequest(400, 'Không có dữ liệu!'));
    }

    res.status(200).json(successfully(user, 'Lấy dữ liệu thành công!'));
  } catch (error: any) {
    res.status(500).json(serverError(error?.message));
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = userSchema.validate(req.body);

    if (error) {
      return res.status(400).json(badRequest(400, error.details[0].message));
    }

    const user = await userService.update(id, req.body);

    if (!user) {
      return res.status(400).json(badRequest(400, 'Sửa dữ liệu thất bại!'));
    }

    res.status(200).json(successfully(user, 'Sửa dữ liệu thành công!'));
  } catch (error: any) {
    res.status(500).json(serverError(error?.message));
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await userService.remove(id);

    if (!user) {
      return res.status(400).json(badRequest(400, 'Xóa dữ liệu thất bại!'));
    }

    res.status(200).json(successfully(user, 'Xóa dữ liệu thành công!'));
  } catch (error: any) {
    res.status(500).json(serverError(error?.message));
  }
};
