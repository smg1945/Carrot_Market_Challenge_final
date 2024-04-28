import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/db";
import getSession from "../../../lib/session";

export async function GET(request: NextRequest) {
  const session = await getSession();
  const user = session.user;

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const tweets = await prisma.tweet.findMany({
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(tweets);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  const user = session.user;

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { content } = await request.json();

  const tweet = await prisma.tweet.create({
    data: {
      content,
      authorId: user.id,
    },
  });

  return NextResponse.json(tweet);
}
