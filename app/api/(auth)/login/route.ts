import connect from "@/lib/db";
import User from "@/lib/models/user";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;
    if (!username || !password) {
      return new NextResponse(
        JSON.stringify({
          message: "Username or password not found",
          status: 400,
        })
      );
    }
    await connect();
    const user = await User.findOne({ username });
    if (!user) {
      return new NextResponse(
        JSON.stringify({
          message: "User not found",
          status: 400,
        })
      );
    }
    if (user.password !== password) {
      return new NextResponse(
        JSON.stringify({
          message: "Password is incorrect",
          status: 400,
        })
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: "Login successful",
        user: user,
        status: 200,
      })
    );
  } catch (error: any) {
    return new NextResponse(error.message, {
      status: 500,
    });
  }
}
