import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/db";

export async function POST(request: NextRequest) {
  const { email, name } = await request.json();

  // 이메일 중복 여부 확인
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json(
      { message: "Email already exists" },
      { status: 400 }
    );
  }

  const user = await prisma.user.create({
    data: {
      email,
      name,
    },
  });
  return NextResponse.json(user, { status: 201 });
}
