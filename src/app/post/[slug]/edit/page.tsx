"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useRef, useState } from "react";

import { getPost, Post } from "@/src/api/postsAPI";
import { editPost } from "@/src/api/adminAPI";
import LoadingButton, {
  LoadingButtonElement,
} from "@/src/components/LoadingButton";
import { useTheme } from "@teispace/next-themes";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
    setError,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<EditPostFormData>({
    resolver: zodResolver(editPostSchema),
    mode: "onTouched",
  });

  const onSubmit = async ({ title, slug, body }: EditPostFormData) => {
    if (!data?.id) {
      setError("form", { message: "Something went wrong (no id)" });
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

    setError("form", { message: result.message });

    if (result.status == 200) {
      setError("form", {
        message: result.message + ", Please wait a second...",
      });
      router.push("/dashboard");
    }
  };

  useEffect(() => {
    getPost(params.slug, true).then((data) => {
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
          </div>
          <p className="error-msg">{errors.slug?.message}</p>

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

export const editPostSchema = z.object({
  title: z.string(),
  slug: z.string(),
  body: z.string(),
});

export type EditPostFormData = z.infer<typeof editPostSchema>;
