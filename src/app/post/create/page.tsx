"use client";

import * as commands from "@uiw/react-md-editor/commands";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";

import { createPost, upload } from "@/src/api/adminAPI";
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
import Dropzone from "@/src/components/Dropzone";

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
    setValue,
    trigger,
    control,
    formState: { errors, isValid },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    mode: "onTouched",
  });

  const onSubmit = async ({ title, slug, body, cover }: PostFormData) => {
    buttonRef.current?.setLoading(true);
    const result = await createPost(title, body, slug, cover as Cover);
    buttonRef.current?.setLoading(false);

    if (result.status == 200) {
      toast.success(result.message + ", Please wait a second...");
      router.push("/admin/dashboard");
      return;
    }
    toast.error(result.message);
  };

  const onUpload = async () => {
    const file = getValues("cover.file")?.[0];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    const imageResult = await upload(formData);
    if (imageResult.error) {
      return toast.error(imageResult.error);
    }
    toast.success("Uploaded your cover to CDN!");
    setValue("cover.src", imageResult.url);
    onPreview(true);
  };

  const onPreview = async (forceDefault: boolean = false) => {
    const values = getValues("cover") as Cover & { file: FileList };
    let cover: Cover = {
      src: values.src,
      type: values.type,
      caption: values.caption,
    };
    if (!forceDefault && values.file?.[0]) {
      cover.src = URL.createObjectURL(values.file[0]);
    }
    setCover(cover);
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

            <label htmlFor="cover" className="text-lg font-semibold">
              Cover
            </label>
            <div className="flex flex-col items-center border border-secondary p-5 rounded-lg">
              <div className="flex gap-4 w-full md:flex-row flex-col items-center">
                <Controller
                  name="cover.file"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <Dropzone
                      onChange={async (e) => {
                        onChange(e.target.files);
                        await trigger("cover.file");
                      }}
                      accept={COVER_ACCEPTED_TYPES.join(",")}
                    />
                  )}
                />
                <button
                  className="md:w-[25%] w-full h-[stretch]"
                  onClick={onUpload}
                  type="button"
                >
                  Upload
                </button>
              </div>
              <p className="my-2 text-lg text-center">- or -</p>
              <div className="flex gap-4 w-full md:flex-row flex-col items-center">
                <input
                  {...register("cover.src")}
                  type="text"
                  id="cover.src"
                  placeholder="Enter a image/video URL"
                  className="md:w-[55%] w-full"
                />
                <div className="flex md:w-[45%] w-full gap-4">
                  <select
                    {...register("cover.type")}
                    className="w-[50%] appearance-none"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                  <button
                    className="w-[50%]"
                    onClick={() => onPreview()}
                    type="button"
                  >
                    Preview
                  </button>
                </div>
              </div>
              <p className="error-msg text-start w-full">
                {errors.cover?.file?.message}
              </p>
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

export const COVER_ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
];

export const postSchema = z.object({
  title: z.string(),
  slug: z.string(),
  body: z.string(),
  cover: z
    .object({
      src: z.string(),
      type: z.string(),
      caption: z.string(),
      file: z
        .custom<FileList | null | undefined>()
        .refine(
          (files) =>
            !files ||
            !(files[0] instanceof File) ||
            files[0].size <= 100 * 1024 * 1024,
          { message: "max file size is 100 MB!" },
        )
        .refine(
          (files) =>
            !files ||
            !(files[0] instanceof File) ||
            COVER_ACCEPTED_TYPES.includes(files[0].type),
          { message: "only images and videos are allowed!" },
        )
        .optional(),
    })
    .optional(),
});

export type PostFormData = z.infer<typeof postSchema>;
