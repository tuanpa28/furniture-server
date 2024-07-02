import { IProduct } from '~/interfaces/product';
import Product from '~/models/Product';

export const findOne = (id: string) => {
  return Product.findById(id);
};

export const findAll = (options: any) => {
  const { skip, limit, sort, ...params } = options;
  return Product.find(params).sort(sort).skip(skip).limit(limit).exec();
};

export const findOneOptions = (options: any) => {
  const query = {
    [options.field]: options.payload,
  };
  return Product.findOne(query).exec();
};

export const findListOptions = ({ field, payload }: any, options: any) => {
  const { skip, limit, sort, ...params } = options;
  const query = {
    [field]: payload,
    ...params,
  };
  return Product.find(query).sort(sort).skip(skip).limit(limit);
};

export const findAggregate = (query: Array<any>) => {
  return Product.aggregate(query).exec();
};

export const countDocuments = (query = {}) => {
  return Product.countDocuments(query).exec();
};

export const create = (createData: IProduct) => {
  const createdProduct = new Product(createData);
  return createdProduct.save();
};

export const update = (id: string, updateEmployee: IProduct) => {
  return Product.findByIdAndUpdate(id, updateEmployee, {
    new: true,
  });
};

export const remove = (id: string) => {
  return Product.findByIdAndDelete(id);
};
