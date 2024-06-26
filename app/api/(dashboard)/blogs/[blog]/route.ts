import connect from "@/lib/db";
import Category from "@/lib/models/category";
import User from "@/lib/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";
import Blog from "@/lib/models/blog";
const ObjectId = require("mongoose").Types.ObjectId;

// get single blog
export const GET = async (request: Request, context: { params: any }) => {
  const blogId = context.params.blog;
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({
          message: "User id not found",
          status: 400,
        })
      );
    }
    if (!Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({
          message: "Blog id not found",
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
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return new NextResponse(
        JSON.stringify({
          message: "Blog not found",
          status: 400,
        })
      );
    }
    return new NextResponse(JSON.stringify({ blog, status: 200 }));
  } catch (error: any) {
    return new NextResponse("Error in fetching users: " + error.message, {
      status: 500,
    });
  }
};

// update blog
export const PATCH = async (request: Request, context: { params: any }) => {
  const blogId = context.params.blog;
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const body = await request.json();
    const { title, description, category } = body;
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({
          message: "User id not found",
          status: 400,
        })
      );
    }
    if (!Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({
          message: "Blog id not found",
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

    const blog = await Blog.findByIdAndUpdate(blogId, {
      title,
      description,
      category,
    });
    if (!blog) {
      return new NextResponse(
        JSON.stringify({
          message: "Blog not found",
          status: 400,
        })
      );
    }
    return new NextResponse(
      JSON.stringify({
        message: "Blog updated successfully",
        blog,
        status: 200,
      })
    );
  } catch (error: any) {
    return new NextResponse("Error in fetching users: " + error.message, {
      status: 500,
    });
  }
};
