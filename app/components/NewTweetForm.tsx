"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";

interface FormData {
  content: string;
}

const createTweet = async (url: string, { arg }: { arg: FormData }) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  });
  return response.json();
};

export default function NewTweetForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { trigger } = useSWRMutation("/api/tweets", createTweet);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onValid = async (data: FormData) => {
    try {
      await trigger(data);
      reset();
      router.refresh();
    } catch (error) {
      console.error(error);
      setError("트윗 작성에 실패하였습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-4">
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          Altweet
        </label>
        <textarea
          id="content"
          {...register("content", { required: "Content is required" })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black"
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Altweet!
      </button>
    </form>
  );
}
