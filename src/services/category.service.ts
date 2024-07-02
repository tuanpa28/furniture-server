import { ICategory } from '~/interfaces/category';
import Category from '~/models/Category';

export const findOne = (id: string) => {
  return Category.findById(id);
};

export const findAll = (options: any) => {
  const { skip, limit, sort, ...params } = options;
  return Category.find(params).sort(sort).skip(skip).limit(limit).exec();
};

export const findOneOptions = (options: any) => {
  const query = {
    [options.field]: options.payload,
  };
  return Category.findOne(query).exec();
};

export const findListOptions = ({ field, payload }: any, options: any) => {
  const { skip, limit, sort, ...params } = options;
  const query = {
    [field]: payload,
    ...params,
  };
  return Category.find(query).sort(sort).skip(skip).limit(limit);
};

export const findAggregate = (query: Array<any>) => {
  return Category.aggregate(query).exec();
};

export const countDocuments = (query = {}) => {
  return Category.countDocuments(query).exec();
};

export const create = (createData: ICategory) => {
  const createdCategory = new Category(createData);
  return createdCategory.save();
};

export const update = (id: string, updateEmployee: ICategory) => {
  return Category.findByIdAndUpdate(id, updateEmployee, {
    new: true,
  });
};

export const remove = (id: string) => {
  return Category.findByIdAndDelete(id);
};
