import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/models/user";
import { Types } from "mongoose";

const ObjectId = require("mongoose").Types.ObjectId;
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, oldPassword, newPassword } = body;
    await connect();
    if (!userId || !oldPassword || !newPassword) {
      return new NextResponse(
        JSON.stringify({
          message: "User id or password not found",
          status: 400,
        })
      );
    }
    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid user id",
          status: 400,
        })
      );
    }
    const user = await User.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return new NextResponse(
        JSON.stringify({
          message: "User not found",
          status: 400,
        })
      );
    }
    if (user.password !== oldPassword) {
      return new NextResponse(
        JSON.stringify({
          message: "Old password is incorrect",
          status: 400,
        })
      );
    }
    const updateUser = await User.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { password: newPassword },
      { new: true }
    );
    if (updateUser) {
      return new NextResponse(
        JSON.stringify({
          message: "Password updated successfully",
          status: 200,
        })
      );
    } else {
      return new NextResponse(
        JSON.stringify({
          message: "Password not updated",
          status: 400,
        })
      );
    }
  } catch (err: any) {
    return new NextResponse("Error in updating password: " + err.message, {
      status: 500,
    });
  }
}
