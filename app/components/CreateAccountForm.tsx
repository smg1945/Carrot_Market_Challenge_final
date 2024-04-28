"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface FormData {
  email: string;
  name: string;
}

export default function CreateAccountForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onValid = async (data: FormData) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push("/login");
      } else {
        const errorData = await response.json();
        if (errorData.message === "Email already exists") {
          setError("이미 사용 중인 이메일입니다.");
        } else {
          setError("계정 생성에 실패하였습니다. 다시 시도해주세요.");
        }
      }
    } catch (error) {
      console.error(error);
      setError("계정 생성에 실패하였습니다. 다시 시도해주세요.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          {...register("email", { required: "Email is required" })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          {...register("name", { required: "Name is required" })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex flex-row justify-between">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Create Account
        </button>
        <div>
          <span>이미 계정이 있으신가요?</span>
          <a href="/login" className="text-indigo-600 hover:underline pl-3">
            로그인
          </a>
        </div>
      </div>
    </form>
  );
}
