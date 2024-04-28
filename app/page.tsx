import { redirect } from "next/navigation";
import NewTweetForm from "./components/NewTweetForm";
import TweetList from "./components/TweetList";
import prisma from "../lib/db";
import getSession from "../lib/session";
import LogoutButton from "./components/LogoutButton";

export default async function Home() {
  const session = await getSession();
  const user = session.user;

  if (!user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  return (
    <div className="container mx-auto">
      <div className="flex flex-row justify-between items-center mt-6">
        <h1 className="text-2xl font-bold mb-4">
          만나서 반가워요! {dbUser?.name}
        </h1>
        <LogoutButton />
      </div>
      <NewTweetForm />
      <TweetList />
    </div>
  );
}
