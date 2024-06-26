import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    username: {
      type: String,
      min: 4,
      max: 50,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      min: 6,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false },
);

UserSchema.index({ username: 'text' });

export default mongoose.model('User', UserSchema);
