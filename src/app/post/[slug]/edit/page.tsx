"use client";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { SubmitEvent, useEffect, useRef, useState } from "react";

import { getPost, Post } from "@/src/api/postsAPI";
import { editPost } from "@/src/api/adminAPI";
import LoadingButton, {
  LoadingButtonElement,
} from "@/src/components/LoadingButton";
import { useTheme } from "@teispace/next-themes";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"));

export default function EditPost() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { resolvedTheme } = useTheme<"light" | "dark">();

  const [body, setBody] = useState("");
  const [data, setData] = useState<Post>();
  const [message, setMessage] = useState("");
  const buttonRef = useRef<LoadingButtonElement>(null);

  const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title");
    const slug = formData.get("slug");

    if (!title || !slug || !body) {
      setMessage("Please fill out title, slug and body!");
      return;
    }

    if (!data?.id) {
      setMessage("Something went wrong (no id)");
      return;
    }

    buttonRef.current?.setLoading(true);
    const result = await editPost(
      data.id,
      title.toString(),
      body,
      slug.toString(),
    );
    buttonRef.current?.setLoading(false);

    setMessage(result.message);

    if (result.status == 200) {
      setMessage(result.message + ", Please wait a second...");
      router.push("/dashboard");
    }
  };

  useEffect(() => {
    getPost(params.slug, true).then((data) => {
      setData(data);
      setBody(data.body);
    });
  }, []);
  return (
    <>
      <div className="flex flex-1 flex-col justify-center items-center px-3">
        <h1 className="text-4xl font-bold mb-4">Edit Post</h1>
        <form
          className="md:p-10 p-4 h-full border border-secondary rounded-2xl flex justify-between flex-col md:w-3/4 w-full"
          onSubmit={onSubmit}
        >
          <div className="flex flex-col gap-2 mb-5">
            <label htmlFor="title" className="text-lg font-semibold">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              defaultValue={data?.title}
              placeholder={
                data?.title
                  ? "Enter a title for your post"
                  : "Please wait a second..."
              }
              disabled={!data?.title}
              required={true}
            />
            <label htmlFor="slug" className="text-lg font-semibold">
              Slug
            </label>
            <input
              type="text"
              name="slug"
              id="slug"
              defaultValue={data?.slug}
              placeholder={
                data?.title
                  ? "Enter a slug for your post"
                  : "Please wait a second..."
              }
              disabled={!data?.title}
              required={true}
            />
          </div>

          <p className="text-lg font-semibold">Body</p>
          <MDEditor
            value={body}
            onChange={(value) => setBody(value || "")}
            className="w-full"
            textareaProps={{
              disabled: !data?.body,
              placeholder: data?.body
                ? "Enter the body for your post"
                : "Please wait a second...",
              required: true
            }}
            data-color-mode={resolvedTheme}
          />

          <LoadingButton ref={buttonRef} />
          <p className="text-center mt-5">{message}</p>
        </form>
      </div>
    </>
  );
}
