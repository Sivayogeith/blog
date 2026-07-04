"use client";
import { SubmitEvent, useRef, useState } from "react";
import { login } from "../../api/authAPI";
import LoadingButton, {
  LoadingButtonElement,
} from "@/src/components/LoadingButton";
import { useRouter } from "nextjs-toploader/app";

export default function Login() {
  const router = useRouter()
  const buttonRef = useRef<LoadingButtonElement>(null);

  const [message, setMessage] = useState("");

  const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const username = form.get("username");
    const password = form.get("password");

    if (!username || !password) {
      setMessage("Please enter username and password!");
      return;
    }

    buttonRef.current?.setLoading(true);
    const result = await login(username.toString(), password.toString());
    buttonRef.current?.setLoading(false);
    setMessage(result.message);

    if (result.status == 200) {
      setMessage(result.message + ", Please wait a second...");
      router.push("/dashboard");
    }
  };

  return (
    <>
      <div className="flex flex-col flex-1 justify-center items-center p-10">
        <h1 className="text-5xl font-bold mb-10">Login</h1>
        <form
          onSubmit={onSubmit}
          className="flex flex-col p-10 border border-secondary rounded-2xl lg:w-[40%] w-full mb-5"
        >
          <label htmlFor="username" className="text-lg font-semibold mb-2">
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Enter your username"
            autoComplete="username"
          />

          <label htmlFor="password" className="text-lg font-semibold mt-5 mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            autoComplete="current-password"
          />

          <LoadingButton ref={buttonRef} />
        </form>
        <p>{message}</p>
      </div>
    </>
  );
}
