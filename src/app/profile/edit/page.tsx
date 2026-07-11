"use client";

import { editProfile, getMe, SessionData } from "@/src/api/authAPI";
import { SubmitEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import LoadingButton, {
  LoadingButtonElement,
} from "@/src/components/LoadingButton";

export default function EditProfile() {
  const [message, setMessage] = useState("");
  const [session, setSession] = useState<SessionData>();
  const buttonRef = useRef<LoadingButtonElement>(null);
  const router = useRouter();

  const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.target);
    const username = form.get("username");
    if (!username) {
      setMessage("Please enter a username!");
      return;
    }
    buttonRef.current?.setLoading(true);
    const result = await editProfile(username.toString());
    buttonRef.current?.setLoading(false);

    setMessage(result.message);
    if (result.status == 200) {
      setMessage(result.message + ", Please wait a second...");
      window.location.href = "/"
      router.replace("/");
    }
  };

  useEffect(() => {
    getMe().then((s) => setSession(s));
  }, []);

  return (
    <div className="flex flex-1 flex-col justify-center items-center px-4">
      <h1 className="text-4xl font-bold mb-5">Edit Profile</h1>
      <form
        onSubmit={onSubmit}
        className="md:p-10 p-6 h-full border border-secondary rounded-2xl flex justify-between flex-col md:w-[35%] w-full"
      >
        <label htmlFor="username" className="text-lg font-semibold">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          defaultValue={session?.username}
          disabled={!session?.username}
          placeholder={session?.username ? "Choose a username" : "Please wait a second.."}
        />
        <LoadingButton ref={buttonRef} />
        <p className="text-center mt-1">{message}</p>
      </form>
    </div>
  );
}
