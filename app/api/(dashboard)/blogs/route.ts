import connect from "@/lib/db";
import Category from "@/lib/models/category";
import User from "@/lib/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";
import Blog from "@/lib/models/blog";
const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({
          message: "User id not found",
          status: 400,
        })
      );
    }
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({
          message: "Category id not found",
          status: 400,
        })
      );
    }
    await connect();
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({
          message: "User not found",
          status: 400,
        })
      );
    }
    const category = await Category.findById(categoryId);
    if (!category) {
      return new NextResponse(
        JSON.stringify({
          message: "Category not found",
          status: 400,
        })
      );
    }

    const blogs = await Blog.find({
      user: new ObjectId(userId),
      category: new ObjectId(categoryId),
    });
    return new NextResponse(JSON.stringify({ blogs, status: 200 }));
  } catch (error: any) {
    return new NextResponse("Error in fetching users: " + error.message, {
      status: 500,
    });
  }
};

export const POST = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({
          message: "User id not found",
          status: 400,
        })
      );
    }
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({
          message: "Category id not found",
          status: 400,
        })
      );
    }
    await connect();
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({
          message: "User not found",
          status: 400,
        })
      );
    }
    const category = await Category.findById(categoryId);
    if (!category) {
      return new NextResponse(
        JSON.stringify({
          message: "Category not found",
          status: 400,
        })
      );
    }

    const body = await request.json();
    const newBlog = new Blog({
      ...body,
      user: new ObjectId(userId),
      category: new ObjectId(categoryId),
    });
    await newBlog.save();
    return new NextResponse(
      JSON.stringify({
        message: "Blog created successfully",
        status: 200,
        newBlog,
      })
    );
  } catch (error: any) {
    return new NextResponse("Error in fetching users: " + error.message, {
      status: 500,
    });
  }
};
