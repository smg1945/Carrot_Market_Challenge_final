import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/db";
import getSession from "../../../../lib/session";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const tweet = await prisma.tweet.findUnique({
    where: { id: Number(params.id) },
    include: {
      author: true,
      likes: true,
    },
  });

  if (!tweet) {
    return NextResponse.json({ message: "Tweet not found" }, { status: 404 });
  }

  return NextResponse.json(tweet);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  const user = session.user;

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const tweetId = Number(params.id);

  const existingLike = await prisma.like.findUnique({
    where: {
      userId_tweetId: {
        userId: user.id,
        tweetId,
      },
    },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });
  } else {
    await prisma.like.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        tweet: {
          connect: {
            id: tweetId,
          },
        },
      },
    });
  }

  const tweet = await prisma.tweet.findUnique({
    where: {
      id: tweetId,
    },
    include: {
      likes: true,
    },
  });

  const likeCount = tweet?.likes.length || 0;

  return NextResponse.json({ likeCount });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  const user = session.user;

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const tweetId = Number(params.id);
  const { content } = await request.json();

  const tweet = await prisma.tweet.findUnique({
    where: { id: tweetId },
  });

  if (!tweet || tweet.authorId !== user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const updatedTweet = await prisma.tweet.update({
    where: { id: tweetId },
    data: { content },
  });

  return NextResponse.json(updatedTweet);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  const user = session.user;

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const tweetId = Number(params.id);

  const tweet = await prisma.tweet.findUnique({
    where: { id: tweetId },
  });

  if (!tweet || tweet.authorId !== user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  await prisma.tweet.delete({
    where: { id: tweetId },
  });

  return NextResponse.json({ message: "트윗이 삭제되었습니다." });
}
