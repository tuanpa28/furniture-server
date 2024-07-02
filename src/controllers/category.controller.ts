import { Request, Response } from 'express';
import { serverError, successfully } from '~/constants/httpStatus';

export const findList = async (req: Request, res: Response) => {
  try {
    console.log(req);

    res.status(200).json(successfully({}, 'Lấy dữ liệu thành công!'));
  } catch (error: any) {
    res.status(500).json(serverError(error?.message));
  }
};
