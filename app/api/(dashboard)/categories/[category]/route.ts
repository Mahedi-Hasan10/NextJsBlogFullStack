import connect from "@/lib/db";
import Category from "@/lib/models/category";
import User from "@/lib/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

const ObjectId = require("mongoose").Types.ObjectId;

export const PATCH = async (request: Request, context: { params: any }) => {
  const categoryId = context.params.category;
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const body = await request.json();
    const { name } = body;

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({
          message: "User id not found",
          status: 400,
        }),
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid category id",
          status: 400,
        }),
        { status: 400 }
      );
    }

    if (!name) {
      return new NextResponse(
        JSON.stringify({
          message: "Category name is required",
          status: 400,
        }),
        { status: 400 }
      );
    }

    await connect();
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({
          message: "User not found",
          status: 400,
        }),
        { status: 400 }
      );
    }

    const category = await Category.findOne({
      _id: new ObjectId(categoryId),
      user: new ObjectId(userId),
    });

    if (!category) {
      return new NextResponse(
        JSON.stringify({
          message: "Category not found",
          status: 400,
        }),
        { status: 400 }
      );
    }

    category.name = name;
    await category.save();

    return new NextResponse(
      JSON.stringify({ message: "Category updated", category, status: 200 }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return new NextResponse("Error in updating category: " + error.message, {
      status: 500,
    });
  }
};

export const DELETE = async (request: Request, context: { params: any }) => {
  const categoryId = context.params.category;
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({
          message: "User id not found",
          status: 400,
        }),
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid category id",
          status: 400,
        }),
        { status: 400 }
      );
    }

    await connect();
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({
          message: "User not found",
          status: 400,
        }),
        { status: 400 }
      );
    }

    const category = await Category.findOne({
      _id: new ObjectId(categoryId),
      user: new ObjectId(userId),
    });

    if (!category) {
      return new NextResponse(
        JSON.stringify({
          message: "Category not found",
          status: 400,
        }),
        { status: 400 }
      );
    }

    await category.deleteOne();

    return new NextResponse(
      JSON.stringify({ message: "Category deleted", status: 200 }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return new NextResponse("Error in deleting category: " + error.message, {
      status: 500,
    });
  }
};
