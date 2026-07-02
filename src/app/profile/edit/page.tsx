"use client";

import { editProfile, getMe, SessionData } from "@/src/api/authAPI";
import { SubmitEvent, useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";

export default function EditProfile() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<SessionData>();
  const router = useRouter();

  const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.target);
    const username = form.get("username");
    if (!username) {
      setMessage("Please enter a username!");
      return;
    }
    setLoading(true);
    const result = await editProfile(username.toString());
    setLoading(false);

    setMessage(result.message);
    if (result.status == 200) {
      setMessage(result.message + ", Please wait a second...");
      router.refresh();
      redirect("/dashboard");
    }
  };

  useEffect(() => {
    getMe().then((s) => setSession(s));
  }, []);

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <form
        onSubmit={onSubmit}
        className="p-10 h-full border border-secondary rounded-2xl flex justify-between flex-col w-3/4"
      >
        <h1 className="text-3xl font-bold mb-2">Edit Profile</h1>
        <label htmlFor="username" className="text-lg font-semibold">
          Username
        </label>
        <input type="text" id="username" name="username" defaultValue={session?.username}/>
        <button className="text-xl bg-linear-65 from-light to-deep-light mt-5 rounded-sm font-bold text-white flex flex-col items-stretch">
          <div
            className={`w-full bg-pale-dark h-1 ${loading ? "" : "invisible"}`}
          >
            <div
              className={`h-full bg-secondary ${loading ? "animate-loading" : ""}`}
            ></div>
          </div>
          <span className="pt-1 pb-2">Submit</span>
        </button>
        <p className="text-center mt-1">{message}</p>
      </form>
    </div>
  );
}
