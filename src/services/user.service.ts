import { IUser } from '~/interfaces/user';
import User from '~/models/User';

export const findOne = (id: string) => {
  return User.findById(id);
};

export const findAll = (options: any): Promise<IUser[]> => {
  const { skip, limit, sort, ...params } = options;
  return User.find(params).sort(sort).skip(skip).limit(limit).exec();
};

export const findOneOptions = (options: any) => {
  const query = {
    [options.field]: options.payload,
  };
  return User.findOne(query).exec();
};

export const findListOptions = ({ field, payload }: any, options: any) => {
  const { skip, limit, sort, ...params } = options;
  const query = {
    [field]: payload,
    ...params,
  };
  return User.find(query).sort(sort).skip(skip).limit(limit);
};

export const findAggregate = (query: Array<any>) => {
  return User.aggregate(query).exec();
};

export const countDocuments = (query = {}) => {
  return User.countDocuments(query).exec();
};

export const create = (createUser: IUser): Promise<IUser> => {
  const createdUser = new User(createUser);
  return createdUser.save();
};

export const update = (id: string, updateEmployee: IUser) => {
  return User.findByIdAndUpdate(id, updateEmployee, {
    new: true,
  });
};

export const remove = (id: string) => {
  return User.findByIdAndDelete(id);
};
