import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { badRequest, serverError, successfully } from '~/constants/httpStatus';
import { userService } from '~/services';
import { isEmail } from '~/utils/checkEmail';
import { generateToken } from '~/utils/jwt';
import { authValidation } from '~/validations';

export const login = async (req: Request, res: Response) => {
  try {
    const { error } = authValidation.loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json(badRequest(400, error.details[0].message));
    }

    const { emailOrUsername, password } = req.body;

    const query = isEmail(emailOrUsername) ? 'email' : 'username';

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
      '1h',
    );

    res.status(200).json(successfully({ user, accessToken }, 'Đăng nhập thành công!'));
  } catch (error: any) {
    res.status(500).json(serverError(error?.message));
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { error } = authValidation.registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json(badRequest(400, error.details[0].message));
    }
    const { username, email, password } = req.body;

    const existingUser = await userService.findOneOptions({
      field: 'username',
      payload: username,
    });

    if (existingUser) {
      return res.status(400).json(badRequest(400, 'Tên người dùng đã tồn tại!'));
    }

    const existingEmail = await userService.findOneOptions({
      field: 'email',
      payload: email,
    });
    if (existingEmail) {
      return res.status(400).json(badRequest(400, 'Địa chỉ email đã tồn tại!'));
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userService.create({
      username,
      email,
      password: hashedPassword,
    });
    res.status(200).json(successfully(newUser, 'Đăng ký thành công !!!'));
  } catch (error: any) {
    res.status(500).json(serverError(error?.message));
  }
};
