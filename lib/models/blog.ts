import { Schema, models, model } from "mongoose";

const BlogSchema = new Schema(
  {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Blog = models.Blog || model("Blog", BlogSchema);
export default Blog;