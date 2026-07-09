"use client";

import { register } from "@/src/api/authAPI";
import LoadingButton, {
  LoadingButtonElement,
} from "@/src/components/LoadingButton";
import { useRouter } from "nextjs-toploader/app";
import { SubmitEvent, useRef, useState } from "react";

export default function Register() {
  const [message, setMessage] = useState("");
  const router = useRouter();
  const buttonRef = useRef<LoadingButtonElement>(null);

  const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.target);
    const username = form.get("username"),
      password = form.get("password"),
      confirmPassword = form.get("confirmPassword");

    if (!username || !password || !confirmPassword) {
      setMessage("Please enter all the fields!");
      return;
    }

    if (confirmPassword !== password) {
      setMessage("The passwords don't match!");
      return;
    }

    buttonRef.current?.setLoading(true);
    const result = await register(username.toString(), password.toString());
    buttonRef.current?.setLoading(false);
    setMessage(result.message);

    if (result.status == 200) {
      setMessage(result.message + ", Please wait a second...");
      window.location.href = "/";
      router.replace("/");
    }
  };
  return (
    <>
      <div className="flex flex-col flex-1 justify-center items-center p-10">
        <h1 className="text-5xl font-bold mb-10">Register</h1>
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
            min="4"
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
            min="8"
          />

          <label
            htmlFor="confirmPassword"
            className="text-lg font-semibold mt-5 mb-2"
          >
            Confirm Password
          </label>
          <input
            type="confirmPassword"
            name="confirmPassword"
            id="confirmPassword"
            placeholder="Confirm your password"
            autoComplete="current-password"
            min="8"
          />

          <LoadingButton ref={buttonRef} />
        </form>
        <p>{message}</p>
      </div>
    </>
  );
}
