import mongoose, { Document, Schema } from 'mongoose';
import randomstring from 'randomstring';
import slugify from 'slugify';

interface Product extends Document {
  name: string;
  slug: string;
  images: string[];
  description: string;
  subCategoryId: mongoose.Types.ObjectId;
}

const ProductSchema = new Schema<Product>(
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
    images: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubCategory',
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

ProductSchema.index({ name: 'text' });

ProductSchema.pre('save', async function (next) {
  try {
    this.slug = slugify(this.name, { replacement: '_', lower: true });

    const Model = mongoose.model<Product>('Product');
    const slug = this.slug;
    // Kiểm tra nếu slug đã tồn tại hoặc là rỗng, thêm chuỗi ngẫu nhiên vào slug
    const existingPro = await Model.findOne({ slug });
    if (existingPro) {
      const randomString = randomstring.generate(8);
      this.slug = `${slug}_${randomString}`;
    }
    next();
  } catch (err) {
    next(err as mongoose.CallbackError);
  }
});

export default mongoose.model('Product', ProductSchema);
