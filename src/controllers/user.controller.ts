import { Request, Response } from 'express';
import { serverError, successfully } from '~/constants/httpStatus';
import { userService } from '~/services';

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
          isError: false,
          statusCode: 200,
          message: 'Successful',
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

// export const findOne = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const user = await userService.findOne(id);

//     if (!user) {
//       return res.status(400).json(badRequest(400, 'Không có dữ liệu!'));
//     }

//     res.status(200).json(successfully(user, 'Lấy dữ liệu thành công!'));
//   } catch (error) {
//     res.status(500).json(serverError(error.message));
//   }
// };
