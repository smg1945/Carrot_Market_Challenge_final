import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/db";
import getSession from "../../../lib/session";

export async function POST(request: NextRequest) {
  const session = await getSession();
  const { email } = await request.json();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json(
      { message: "등록되지 않은 이메일입니다." },
      { status: 401 }
    );
  }

  session.user = {
    id: user.id,
  };
  const sessionValue = await session.save();

  const response = NextResponse.json({ ok: true });
  response.headers.set("Set-Cookie", sessionValue);
  return response;
}
