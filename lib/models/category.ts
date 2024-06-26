import { Schema, model, models } from "mongoose";

const CategorySchema = new Schema(
  {
    name: { type: "string", required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Category = models.Category || model("Category", CategorySchema);
export default Category;
