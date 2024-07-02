import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { badRequest, serverError, successfully } from '~/constants/httpStatus';
import { userService } from '~/services';
import { generateToken } from '~/utils/jwt';
import { authValidation } from '~/validations';

export const login = async (req: Request, res: Response) => {
  try {
    const { error } = authValidation.loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json(badRequest(400, error.details[0].message));
    }

    const { emailOrUsername, password } = req.body;

    // const query = isEmail(emailOrUsername) ? 'email' : 'username';
    const query = 'username';

    // check if email or username exists
    const user = await userService.findOneOptions({
      field: query,
      payload: emailOrUsername,
    });
    if (!user) {
      return res.status(400).json(badRequest(400, 'Tài khoản không tồn tại!'));
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json(badRequest(400, 'Mật khẩu không hợp lệ!'));
    }

    const accessToken = generateToken(
      {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      '1d',
    );

    res.status(200).json(successfully({ user, accessToken }, 'Đăng nhập thành công!'));
  } catch (error: any) {
    res.status(500).json(serverError(error?.message));
  }
};
