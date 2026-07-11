"use client";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import * as commands from "@uiw/react-md-editor/commands";
import dynamic from "next/dynamic";
import { SubmitEvent, useState } from "react";

import { createPost } from "@/src/api/adminAPI";
import { useRouter } from "nextjs-toploader/app";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"));

export default function CreatePost() {
  const router = useRouter();

  const [body, setBody] = useState("**meow**");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title");
    const slug = formData.get("slug");

    if (!title || !slug) {
      setMessage("Please enter the title and slug!");
      return;
    }

    setLoading(true);
    const result = await createPost(title.toString(), body, slug.toString());
    setLoading(false);

    setMessage(result.message);

    if (result.status == 200) {
      setMessage(result.message + ", Please wait a second...");
      router.push("/dashboard");
    }
  };
  return (
    <>
      <div className="flex flex-1 flex-col justify-center items-center">
        <form
          className="p-10 h-full border border-secondary rounded-2xl flex justify-between flex-col w-3/4"
          onSubmit={onSubmit}
        >
          <h1 className="text-3xl font-bold mb-2">Create New Post</h1>
          <div className="flex flex-col gap-2 mb-5">
            <label htmlFor="title" className="text-lg font-semibold">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="Enter the title of the post"
            />
            <label htmlFor="slug" className="text-lg font-semibold">
              Slug
            </label>
            <input
              type="text"
              name="slug"
              id="slug"
              placeholder="Enter the slug of the post"
            />
          </div>
          <p className="text-lg font-semibold">Body</p>
          <MDEditor
            value={body}
            onChange={(value) => setBody(value || "")}
            className="w-full"
          />
          <button className="text-xl bg-linear-65 from-light to-deep-light mt-10 rounded-sm font-bold text-white flex flex-col items-stretch">
            <div
              className={`w-full bg-pale-dark h-1 ${loading ? "" : "invisible"}`}
            >
              <div
                className={`h-full bg-secondary ${loading ? "animate-loading" : ""}`}
              ></div>
            </div>
            <span className="pt-1 pb-2">Submit</span>
          </button>
          <p className="text-center mt-5">{message}</p>
        </form>
      </div>
    </>
  );
}
