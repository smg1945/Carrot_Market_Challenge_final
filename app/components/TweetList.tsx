"use client";

import useSWR from "swr";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TweetList() {
  const { data: tweets, error } = useSWR("/api/tweets", fetcher);

  if (error) return <div>알트윗 불러오기를 실패하였습니다.</div>;
  if (!tweets) return <div>로딩중...</div>;

  return (
    <ul className="space-y-4 mt-6">
      {tweets.map((tweet: any) => (
        <li key={tweet.id} className="bg-white shadow-md rounded-lg p-4">
          <Link
            href={`/tweet/${tweet.id}`}
            className="text-lg font-medium text-blue-600 hover:underline"
          >
            {tweet.content}
          </Link>
          <p className="mt-2 text-sm text-gray-500">by {tweet.author.name}</p>
        </li>
      ))}
    </ul>
  );
}
