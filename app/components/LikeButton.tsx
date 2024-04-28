"use client";

import useSWRMutation from "swr/mutation";
import { useState } from "react";

const likeTweet = async (url: string) => {
  const response = await fetch(url, {
    method: "POST",
  });
  return response.json();
};

interface LikeButtonProps {
  tweetId: number;
  likes: number;
  onLike: (newLikeCount: number) => void;
}

export default function LikeButton({ tweetId, onLike }: LikeButtonProps) {
  const { trigger } = useSWRMutation(`/api/tweets/${tweetId}`, likeTweet);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    try {
      const result = await trigger();
      const newLikeCount = result.likeCount;
      setIsLiked(!isLiked);
      onLike(newLikeCount);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        isLiked
          ? "text-red-600 bg-red-100 hover:bg-red-200 focus:ring-red-500"
          : "text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-gray-500"
      }`}
    >
      {isLiked ? "좋아요 해제" : "좋아요"}
    </button>
  );
}
