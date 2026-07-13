"use client";

import * as commands from "@uiw/react-md-editor/commands";
import dynamic from "next/dynamic";
import { useRef } from "react";

import { createPost } from "@/src/api/adminAPI";
import { useRouter } from "nextjs-toploader/app";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton, {
  LoadingButtonElement,
} from "@/src/components/LoadingButton";
import { useTheme } from "@teispace/next-themes";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"));

export default function CreatePost() {
  const router = useRouter();
  const { resolvedTheme } = useTheme<"light" | "dark">();
  const buttonRef = useRef<LoadingButtonElement>(null);
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isValid },
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    mode: "onTouched",
  });

  const onSubmit = async ({ title, slug, body }: CreatePostFormData) => {
    buttonRef.current?.setLoading(true);
    const result = await createPost(title, body, slug);
    buttonRef.current?.setLoading(false);

    setError("form", { message: result.message });

    if (result.status == 200) {
      setError("form", {
        message: result.message + ", Please wait a second...",
      });
      router.push("/dashboard");
    }
  };
  return (
    <>
      <div className="flex flex-1 flex-col justify-center items-center px-3">
        <h1 className="text-4xl font-bold mb-4">Create New Post</h1>
        <form
          className="md:p-10 p-4 h-full border border-secondary rounded-2xl flex justify-between flex-col lg:w-3/4 w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-2 mb-5">
            <label htmlFor="title" className="text-lg font-semibold">
              Title
            </label>
            <input
              {...register("title")}
              type="text"
              id="title"
              placeholder="Enter the title of the post"
            />
            <p>{errors.title?.message}</p>
            <label htmlFor="slug" className="text-lg font-semibold">
              Slug
            </label>
            <input
              {...register("slug")}
              type="text"
              id="slug"
              placeholder="Enter the slug of the post"
            />
            <p className="error-msg">{errors.slug?.message}</p>
          </div>
          <p className="text-lg font-semibold">Body</p>
          <Controller
            name="body"
            control={control}
            render={({ field }) => (
              <MDEditor
                {...field}
                className="w-full"
                data-color-mode={resolvedTheme}
              />
            )}
          />
          <LoadingButton ref={buttonRef} disabled={!isValid} />
          <p className="text-center mt-5">{errors.form?.message}</p>
        </form>
      </div>
    </>
  );
}

export const createPostSchema = z.object({
  title: z.string(),
  slug: z.string(),
  body: z.string(),
});

export type CreatePostFormData = z.infer<typeof createPostSchema>;
