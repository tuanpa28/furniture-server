import mongoose, { Schema } from 'mongoose';
import randomstring from 'randomstring';
import slugify from 'slugify';

const SubCategorySchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        default: [],
      },
    ],
  },
  { timestamps: true, versionKey: false },
);

SubCategorySchema.pre('save', async function (next) {
  try {
    this.slug = slugify(this.name, { replacement: '_', lower: true });

    const model = mongoose.model('SubCategory');
    const slug = this.slug;
    // Kiểm tra nếu slug đã tồn tại hoặc là rỗng, thêm chuỗi ngẫu nhiên vào slug
    const existingCate = await model.findOne({ slug });
    if (existingCate) {
      const randomString = randomstring.generate(8);
      this.slug = `${slug}_${randomString}`;
    }
    next();
  } catch (err) {
    next(err as mongoose.CallbackError);
  }
});

SubCategorySchema.pre('findOneAndDelete', async function (next) {
  try {
    const Product = mongoose.model('Product');
    const filter = this.getFilter();
    const update = {
      subCategoryId: null,
    };

    await Product.updateMany(
      {
        subCategoryId: filter._id,
      },
      update,
    );
    next();
  } catch (err) {
    next(err as mongoose.CallbackError);
  }
});

export default mongoose.model('SubCategory', SubCategorySchema);
