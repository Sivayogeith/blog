"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useRef, useState } from "react";

import { getPost, Post } from "@/src/api/postsAPI";
import { editPost, upload } from "@/src/api/adminAPI";
import LoadingButton, {
  LoadingButtonElement,
} from "@/src/components/LoadingButton";
import { useTheme } from "@teispace/next-themes";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ACCEPTED_TYPES, PostFormData, postSchema } from "../../create/page";
import PostCover, { Cover } from "@/src/components/PostCover";
import Markdown from "@/src/components/Markdown";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"));

export default function EditPost() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { resolvedTheme } = useTheme<"light" | "dark">();

  const buttonRef = useRef<LoadingButtonElement>(null);
  const [data, setData] = useState<Post>();
  const {
    register,
    setValues,
    setValue,
    handleSubmit,
    getValues,
    control,
    formState: { errors, isValid },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    mode: "onTouched",
  });

  const onSubmit = async ({ title, slug, body, cover }: PostFormData) => {
    if (!data?.id) {
      toast.error("Something went wrong (no id)");
      return;
    }

    buttonRef.current?.setLoading(true);
    const result = await editPost(data.id, title, body, slug, cover as Cover);
    buttonRef.current?.setLoading(false);

    if (result.status == 200) {
      toast.success(result.message + ", Please wait a second...");
      router.push("/dashboard");
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
    if (!forceDefault && values.file[0]) {
      cover.src = URL.createObjectURL(values.file[0]);
    }
    setData({
      ...data,
      cover: values as Cover,
    } as Post);
  };

  useEffect(() => {
    getPost(params.slug).then((data) => {
      setValues(data, { shouldValidate: true });
      setData(data);
    });
  }, []);
  return (
    <>
      <div className="flex flex-1 flex-col justify-center items-center px-3">
        <h1 className="text-4xl font-bold mb-4">Edit Post</h1>
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
              placeholder={
                data?.title
                  ? "Enter a title for your post"
                  : "Please wait a second..."
              }
              disabled={!data?.title}
            />
            <p className="error-msg">{errors.title?.message}</p>
            <label htmlFor="slug" className="text-lg font-semibold">
              Slug
            </label>
            <input
              {...register("slug")}
              type="text"
              placeholder={
                data?.title
                  ? "Enter a slug for your post"
                  : "Please wait a second..."
              }
              disabled={!data?.title}
            />
            <p className="error-msg">{errors.slug?.message}</p>
            <label htmlFor="cover" className="text-lg font-semibold">
              Cover
            </label>
            <div className="flex flex-col items-center border border-secondary p-5 rounded-lg">
              <div className="flex gap-4 w-full md:flex-row flex-col">
                <input
                  {...register("cover.file")}
                  type="file"
                  id="files"
                  className="w-[75%] border border-secondary p-2 rounded-sm text-center cursor-pointer"
                  accept={ACCEPTED_TYPES.join(",")}
                />
                <button
                  className="border border-secondary p-2 rounded-sm w-[25%]"
                  onClick={onUpload}
                  type="button"
                >
                  Upload
                </button>
              </div>
              <p className="my-2 text-lg text-center">- or -</p>
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
                    className="w-[56%] appearance-none"
                    defaultValue="image"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                  <button
                    className="border border-secondary p-2 rounded-sm w-[44%]"
                    onClick={() => onPreview()}
                    type="button"
                  >
                    Preview
                  </button>
                </div>
              </div>
              {data?.cover?.src ? (
                <PostCover post={data} className="w-auto h-[50%] my-4" />
              ) : (
                <div className="border-2 border-dashed border-secondary w-[50%] h-60 my-4"></div>
              )}
              {data?.cover?.caption && (
                <Markdown
                  class="text-sm! mb-1 text-center opacity-70"
                  source={data?.cover?.caption}
                />
              )}
              {(!data?.cover || data?.cover.caption) && (
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
                textareaProps={{
                  disabled: !data?.body,
                  placeholder: data?.body
                    ? "Enter the body for your post"
                    : "Please wait a second...",
                }}
                data-color-mode={resolvedTheme}
              />
            )}
          />
          <p className="error-msg">{errors.body?.message}</p>

          <LoadingButton ref={buttonRef} disabled={!isValid} />
          <p className="text-center mt-5">{errors.form?.message}</p>
        </form>
      </div>
    </>
  );
}
