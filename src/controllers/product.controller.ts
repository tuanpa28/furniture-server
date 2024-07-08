import { Request, Response } from 'express';
import { badRequest, serverError, successfully } from '~/constants/httpStatus';
import SubCategory from '~/models/SubCategory';
import { categoryService, productService, subCategoryService } from '~/services';
import { productSchema } from '~/validations/product.validation';

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

    const [products, count] = await Promise.all([productService.findAll(options), productService.countDocuments()]);

    res.status(200).json(
      successfully(
        {
          data: products,
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

export const findListByCategory = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const { page = 1, limit = 10, _sort = 'createdAt', _order = 'asc', ...params } = req.query;

    const { skip, sort } = {
      skip: (Number(page) - 1) * Number(limit),
      sort: {
        [String(_sort)]: _order === 'desc' ? -1 : 1,
      },
    };

    const pipeline = [
      {
        $match: {
          slug,
          ...params,
        },
      },
      { $sort: sort },
      { $skip: skip },
      { $limit: Number(limit) },
      {
        $lookup: {
          from: 'subcategories',
          localField: '_id',
          foreignField: 'categoryId',
          as: 'subCategory',
        },
      },
      {
        $unwind: '$subCategory',
      },
      {
        $lookup: {
          from: 'products',
          localField: 'subCategory._id',
          foreignField: 'subCategoryId',
          as: 'product',
        },
      },
      {
        $unwind: '$product',
      },
      {
        $project: {
          _id: '$product._id',
          name: '$product.name',
          slug: '$product.slug',
          images: '$product.images',
          description: '$product.description',
          category: {
            name: '$name',
            slug: '$slug',
          },
          subCategory: {
            name: '$subCategory.name',
            slug: '$subCategory.slug',
          },
        },
      },
    ];

    const countPipeline = [
      {
        $match: {
          slug,
          ...params,
        },
      },
      {
        $lookup: {
          from: 'subcategories',
          localField: '_id',
          foreignField: 'categoryId',
          as: 'subCategory',
        },
      },
      {
        $unwind: '$subCategory',
      },
      {
        $lookup: {
          from: 'products',
          localField: 'subCategory._id',
          foreignField: 'subCategoryId',
          as: 'product',
        },
      },
      {
        $unwind: '$product',
      },
      { $count: 'count' },
    ];

    const [products, countResults] = await Promise.all([
      categoryService.findAggregate(pipeline),
      categoryService.findAggregate(countPipeline),
    ]);

    const count = countResults.length > 0 ? countResults[0].count : 0;

    res.status(200).json(
      successfully(
        {
          data: products,
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

export const findListBySubCategory = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const { page = 1, limit = 10, _sort = 'createdAt', _order = 'asc', ...params } = req.query;

    const { skip, sort } = {
      skip: (Number(page) - 1) * Number(limit),
      sort: {
        [String(_sort)]: _order === 'desc' ? -1 : 1,
      },
    };

    const pipeline = [
      {
        $match: {
          slug,
          ...params,
        },
      },
      { $sort: sort },
      { $skip: skip },
      { $limit: Number(limit) },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: '$category',
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'subCategoryId',
          as: 'product',
        },
      },
      {
        $unwind: '$product',
      },
      {
        $project: {
          _id: '$product._id',
          name: '$product.name',
          slug: '$product.slug',
          images: '$product.images',
          description: '$product.description',
          category: {
            name: '$category.name',
            slug: '$category.slug',
          },
          subCategory: {
            name: '$name',
            slug: '$slug',
          },
        },
      },
    ];

    const countPipeline = [
      {
        $match: {
          slug,
          ...params,
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: '$category',
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'subCategoryId',
          as: 'product',
        },
      },
      {
        $unwind: '$product',
      },
      { $count: 'count' },
    ];

    const [products, countResults] = await Promise.all([
      subCategoryService.findAggregate(pipeline),
      subCategoryService.findAggregate(countPipeline),
    ]);

    const count = countResults.length > 0 ? countResults[0].count : 0;

    res.status(200).json(
      successfully(
        {
          data: products,
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

export const findListRelated = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const { page = 1, limit = 10, _sort = 'createdAt', _order = 'asc', ...params } = req.query;

    const { skip, sort } = {
      skip: (Number(page) - 1) * Number(limit),
      sort: {
        [String(_sort)]: _order === 'desc' ? -1 : 1,
      },
    };

    const pipeline = [
      {
        $match: {
          slug,
          ...params,
        },
      },
      { $sort: sort },
      { $skip: skip },
      { $limit: Number(limit) },
      {
        $lookup: {
          from: 'subcategories',
          localField: 'subCategoryId',
          foreignField: '_id',
          as: 'subCategory',
        },
      },
      {
        $unwind: '$subCategory',
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'subCategory.categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: '$category',
      },
      {
        $lookup: {
          from: 'subcategories',
          localField: 'category._id',
          foreignField: 'categoryId',
          as: 'allSubCategories',
        },
      },
      {
        $unwind: '$allSubCategories',
      },
      {
        $lookup: {
          from: 'products',
          localField: 'allSubCategories._id',
          foreignField: 'subCategoryId',
          as: 'products',
        },
      },
      {
        $unwind: '$products',
      },
      {
        $match: { 'products.slug': { $ne: slug } },
      },
      {
        $addFields: {
          'products.category': {
            name: '$category.name',
            slug: '$category.slug',
          },
          'products.subCategory': {
            name: '$subCategory.name',
            slug: '$subCategory.slug',
          },
        },
      },
      {
        $replaceRoot: { newRoot: '$products' },
      },
    ];

    const countPipeline = [
      {
        $match: {
          slug,
          ...params,
        },
      },
      {
        $lookup: {
          from: 'subcategories',
          localField: 'subCategoryId',
          foreignField: '_id',
          as: 'subCategory',
        },
      },
      {
        $unwind: '$subCategory',
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'subCategory.categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: '$category',
      },
      {
        $lookup: {
          from: 'subcategories',
          localField: 'category._id',
          foreignField: 'categoryId',
          as: 'allSubCategories',
        },
      },
      {
        $unwind: '$allSubCategories',
      },
      {
        $lookup: {
          from: 'products',
          localField: 'allSubCategories._id',
          foreignField: 'subCategoryId',
          as: 'products',
        },
      },
      {
        $unwind: '$products',
      },
      {
        $match: { 'products.slug': { $ne: slug } },
      },
      { $count: 'count' },
    ];

    const [products, countResults] = await Promise.all([
      productService.findAggregate(pipeline),
      productService.findAggregate(countPipeline),
    ]);

    const count = countResults.length > 0 ? countResults[0].count : 0;

    res.status(200).json(
      successfully(
        {
          data: products,
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
    const product = await productService.findOne(id);

    if (!product) {
      return res.status(400).json(badRequest(400, 'Không có dữ liệu!'));
    }

    res.status(200).json(successfully(product, 'Lấy dữ liệu thành công!'));
  } catch (error: any) {
    res.status(500).json(serverError(error?.message));
  }
};

export const findOneBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const pipeline = [
      {
        $match: {
          slug,
        },
      },
      {
        $lookup: {
          from: 'subcategories',
          localField: 'subCategoryId',
          foreignField: '_id',
          as: 'subCategory',
        },
      },
      { $unwind: '$subCategory' },
      {
        $lookup: {
          from: 'categories',
          localField: 'subCategory.categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: '$category',
      },
      {
        $project: {
          _id: '$_id',
          name: '$name',
          slug: '$slug',
          images: '$images',
          description: '$description',
          category: {
            name: '$category.name',
            slug: '$category.slug',
          },
          subCategory: {
            name: '$subCategory.name',
            slug: '$subCategory.slug',
          },
        },
      },
    ];

    const [product] = await productService.findAggregate(pipeline);

    if (!product) {
      return res.status(400).json(badRequest(400, 'Không có dữ liệu!'));
    }

    res.status(200).json(successfully(product, 'Lấy dữ liệu thành công!'));
  } catch (error: any) {
    res.status(500).json(serverError(error?.message));
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const { error } = productSchema.validate(req.body);

    if (error) {
      return res.status(400).json(badRequest(400, error.details[0].message));
    }

    const product = await productService.create(req.body);

    if (!product) {
      return res.status(400).json(badRequest(400, 'Thêm dữ liệu thất bại!'));
    }

    await SubCategory.findByIdAndUpdate(product.subCategoryId, {
      $addToSet: { products: product._id },
    });

    res.status(200).json(successfully(product, 'Thêm dữ liệu thành công!'));
  } catch (error: any) {
    res.status(500).json(serverError(error?.message));
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = productSchema.validate(req.body);

    if (error) {
      return res.status(400).json(badRequest(400, error.details[0].message));
    }

    const product = await productService.update(id, req.body);

    if (!product) {
      return res.status(400).json(badRequest(400, 'Sửa dữ liệu thất bại!'));
    }

    await Promise.all([
      SubCategory.findByIdAndUpdate(product?.subCategoryId, {
        $pull: { products: product?._id },
      }),
      SubCategory.findByIdAndUpdate(req.body.subCategoryId, {
        $addToSet: { products: product?._id },
      }),
    ]);

    res.status(200).json(successfully(product, 'Sửa dữ liệu thành công!'));
  } catch (error: any) {
    res.status(500).json(serverError(error?.message));
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await productService.remove(id);

    if (!product) {
      return res.status(400).json(badRequest(400, 'Xóa dữ liệu thất bại!'));
    }

    await SubCategory.findByIdAndUpdate(product?.subCategoryId, {
      $pull: { products: product?._id },
    });

    res.status(200).json(successfully(product, 'Xóa dữ liệu thành công!'));
  } catch (error: any) {
    res.status(500).json(serverError(error?.message));
  }
};
