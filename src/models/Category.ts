import mongoose, { Schema } from 'mongoose';
import randomstring from 'randomstring';
import slugify from 'slugify';

const CategorySchema = new Schema(
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
    subCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
        default: [],
      },
    ],
  },
  { timestamps: true, versionKey: false },
);

CategorySchema.pre('save', async function (next) {
  try {
    this.slug = slugify(this.name, { replacement: '_', lower: true });

    const model = mongoose.model('Category');
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

CategorySchema.pre('findOneAndDelete', async function (next) {
  try {
    const SubCategory = mongoose.model('SubCategory');
    const filter = this.getFilter(); // Lấy điều kiện tìm kiếm hiện tại của truy vấn
    const update = {
      categoryId: null,
    };

    await SubCategory.updateMany(
      {
        categoryId: filter._id, // Tìm các sản phẩm cùng categoryId
      },
      update,
    );
    next();
  } catch (err) {
    next(err as mongoose.CallbackError);
  }
});

export default mongoose.model('Category', CategorySchema);
