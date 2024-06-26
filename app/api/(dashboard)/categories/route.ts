import connect from "@/lib/db";
import Category from "@/lib/models/category";
import User from "@/lib/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async (request: Request) => {
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
    await connect();
    const user = await User.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return new NextResponse(
        JSON.stringify({
          message: "User not found",
          status: 400,
        })
      );
    }

    const categories = await Category.find({ user: new ObjectId(userId) });

    return new NextResponse(JSON.stringify({ categories, status: 200 }));
  } catch (err: any) {
    console.error("Error in fetching categories:", err.message);
    return new NextResponse("Error in fetching categories: " + err.message, {
      status: 500,
    });
  }
};

export const POST = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const { name } = await request.json();
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({
          message: "User id not found",
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

    const newCategory = new Category({
      name,
      user: new ObjectId(userId),
    });
    await newCategory.save();
    return new NextResponse(
      JSON.stringify({ message: "Category created", status: 200 })
    );
  } catch (error: any) {
    return new NextResponse("Error in creating category: " + error.message, {
      status: 500,
    });
  }
};
