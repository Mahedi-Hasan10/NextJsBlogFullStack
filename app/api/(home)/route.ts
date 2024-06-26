import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  return new NextResponse("Welcome to blog api");
};
