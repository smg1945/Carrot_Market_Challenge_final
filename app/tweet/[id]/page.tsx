import { notFound } from "next/navigation";
import prisma from "../../../lib/db";
import getSession from "../../../lib/session";
import TweetDetail from "../../components/TweetDetail";

interface TweetPageProps {
  params: { id: string };
}

export default async function TweetPage({ params }: TweetPageProps) {
  const { id } = params;

  const [tweet, session] = await Promise.all([
    prisma.tweet.findUnique({
      where: { id: Number(id) },
      include: { author: true, likes: true },
    }),
    getSession(),
  ]);

  if (!tweet) {
    notFound();
  }

  return <TweetDetail tweet={tweet} session={session} />;
}
