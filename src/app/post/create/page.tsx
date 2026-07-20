"use client";

import * as commands from "@uiw/react-md-editor/commands";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";

import { createPost } from "@/src/api/adminAPI";
import { useRouter } from "nextjs-toploader/app";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton, {
  LoadingButtonElement,
} from "@/src/components/LoadingButton";
import { useTheme } from "@teispace/next-themes";
import { toast } from "sonner";
import PostCover, { Cover } from "@/src/components/PostCover";
import { Post } from "@/src/api/helper";
import Markdown from "@/src/components/Markdown";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"));

export default function CreatePost() {
  const router = useRouter();
  const { resolvedTheme } = useTheme<"light" | "dark">();
  const buttonRef = useRef<LoadingButtonElement>(null);
  const [cover, setCover] = useState<Cover>({} as Cover);
  const {
    register,
    handleSubmit,
    getValues,
    control,
    formState: { errors, isValid },
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    mode: "onTouched",
  });

  const onSubmit = async ({ title, slug, body, cover }: CreatePostFormData) => {
    buttonRef.current?.setLoading(true);
    const result = await createPost(title, body, slug, cover as Cover);
    buttonRef.current?.setLoading(false);

    if (result.status == 200) {
      toast.success(result.message + ", Please wait a second...");
      router.push("/dashboard");
      return;
    }
    toast.error(result.message);
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

            <label htmlFor="slug" className="text-lg font-semibold">
              Cover
            </label>
            <div className="flex flex-col items-center border border-secondary p-5 rounded-lg">
              <div className="flex gap-4 w-full md:flex-row flex-col">
                <input
                  {...register("cover.src")}
                  type="text"
                  id="cover.src"
                  placeholder="Enter a image/video URL"
                  className="md:w-[55%] w-full"
                />
                <div className="flex md:w-[45%] gap-4">
                  <select
                    {...register("cover.type")}
                    className="w-[56%] appearance-none "
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                  <button
                    className="border border-secondary p-2 rounded-sm w-[44%]"
                    onClick={() => setCover(getValues("cover") as Cover)}
                    type="button"
                  >
                    Preview
                  </button>
                </div>
              </div>
              {cover.src ? (
                <PostCover
                  post={{ cover } as Post}
                  className="w-auto h-[50%] my-4"
                />
              ) : (
                <div className="border-2 border-dashed border-secondary w-[50%] h-60 my-4"></div>
              )}
              {cover?.caption && (
                <Markdown
                  class="text-sm! mb-1 text-center opacity-70"
                  source={cover?.caption}
                />
              )}
              {(!cover || cover.caption) && (
                <hr className="mb-3 opacity-70 w-full" />
              )}
              <input
                {...register("cover.caption")}
                type="text"
                id="cover.caption"
                placeholder="Enter a caption"
                className="w-full"
              />
            </div>
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
  cover: z.object({
    src: z.string().optional(),
    type: z.string().optional(),
    caption: z.string().optional(),
  }),
});

export type CreatePostFormData = z.infer<typeof createPostSchema>;
