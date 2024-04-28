"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import EditTweetForm from "./EditTweetForm";
import LikeButton from "./LikeButton";

interface TweetDetailProps {
  tweet: any;
  session: any;
}

export default function TweetDetail({ tweet, session }: TweetDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [likeCount, setLikeCount] = useState(tweet.likes.length);
  const router = useRouter();

  const isAuthor = session?.user?.id === tweet.authorId;

  const handleDelete = async () => {
    if (confirm("트윗을 정말 삭제할까요?")) {
      await fetch(`/api/tweets/${tweet.id}`, {
        method: "DELETE",
      });
      router.push("/");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleLike = (newLikeCount: number) => {
    setLikeCount(newLikeCount);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      {isEditing ? (
        <EditTweetForm
          tweetId={tweet.id}
          content={tweet.content}
          onCancel={handleCancelEdit}
        />
      ) : (
        <>
          <p className="text-lg mb-2 text-black">{tweet.content}</p>
          <p className="text-sm text-gray-500">by {tweet.author.name}</p>
          <p className="text-sm text-gray-500 mb-2">Likes: {likeCount}</p>
          <LikeButton
            tweetId={tweet.id}
            likes={likeCount}
            onLike={handleLike}
          />
          {isAuthor && (
            <div className="mt-4">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded mr-2"
                onClick={handleDelete}
              >
                삭제
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={handleEdit}
              >
                수정
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
