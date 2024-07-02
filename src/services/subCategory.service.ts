import { ISubCategory } from '~/interfaces/subCategory';
import SubCategory from '~/models/SubCategory';

export const findOne = (id: string) => {
  return SubCategory.findById(id);
};

export const findAll = (options: any) => {
  const { skip, limit, sort, ...params } = options;
  return SubCategory.find(params).sort(sort).skip(skip).limit(limit).exec();
};

export const findOneOptions = (options: any) => {
  const query = {
    [options.field]: options.payload,
  };
  return SubCategory.findOne(query).exec();
};

export const findListOptions = ({ field, payload }: any, options: any) => {
  const { skip, limit, sort, ...params } = options;
  const query = {
    [field]: payload,
    ...params,
  };
  return SubCategory.find(query).sort(sort).skip(skip).limit(limit);
};

export const findAggregate = (query: Array<any>) => {
  return SubCategory.aggregate(query).exec();
};

export const countDocuments = (query = {}) => {
  return SubCategory.countDocuments(query).exec();
};

export const create = (createData: ISubCategory) => {
  const createdSubCategory = new SubCategory(createData);
  return createdSubCategory.save();
};

export const update = (id: string, updateEmployee: ISubCategory) => {
  return SubCategory.findByIdAndUpdate(id, updateEmployee, {
    new: true,
  });
};

export const remove = (id: string) => {
  return SubCategory.findByIdAndDelete(id);
};
