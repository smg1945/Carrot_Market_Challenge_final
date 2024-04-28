"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface EditTweetFormProps {
  tweetId: number;
  content: string;
  onCancel: () => void;
}

export default function EditTweetForm({
  tweetId,
  content,
  onCancel,
}: EditTweetFormProps) {
  const [tweetContent, setTweetContent] = useState(content);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/tweets/${tweetId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: tweetContent }),
      });

      if (response.ok) {
        router.refresh();
        onCancel();
      } else {
        console.error("트윗 업데이트 실패");
      }
    } catch (error) {
      console.error("트윗 업데이트 오류:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={tweetContent}
        onChange={(e) => setTweetContent(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded text-black"
      />
      <div className="mt-4">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded mr-2"
        >
          업데이트
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
          onClick={onCancel}
        >
          취소
        </button>
      </div>
    </form>
  );
}
