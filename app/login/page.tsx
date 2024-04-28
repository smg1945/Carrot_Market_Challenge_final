import { redirect } from "next/navigation";
import LoginForm from "../components/LoginForm";
import getSession from "../../lib/session";

export default async function Login() {
  const session = await getSession();
  const user = session.user;

  if (user) {
    redirect("/");
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Altweet에 오신 것을 환영합니다!
      </h1>
      <LoginForm />
      <div>
        <p className="text-center mt-4">
          처음이신가요?
          <a href="/create-account" className="text-blue-500 ml-4">
            계정 생성
          </a>
        </p>
      </div>
    </div>
  );
}
