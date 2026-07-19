"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { addComment, Post } from "../api/postsAPI";
import { toast } from "sonner";
import SendIcon from "./icons/SendIcon";

export default function CommentForm({ post }: { post: Post }) {
  const {
    register,
    handleSubmit,
    formState: { isValid },
    watch,
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    mode: "onTouched",
  });
  const text = watch("text", "");

  const onSubmit = async ({ text }: CommentFormData) => {
    const result = await addComment(post.id, text);
    if (result.status == 200) {
      return toast.success(result.message);
    }
    toast.error(result.message);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
      <div className="flex w-full">
        <textarea {...register("text")} placeholder="Enter your comment here" className="lg:w-[55vw] w-full rounded-e-none!" />
        <button className="border-y border-e border-secondary  rounded-s-none rounded-sm p-2" disabled={!isValid}>
          <SendIcon className="size-6"/>
        </button>
      </div>
      <p className={`${isValid && "dark:text-green-400! text-green-700!"} error-msg text-end`}>{text.length}/150 chars (min. 10)</p>
    </form>
  );
}

export const commentSchema = z.object({
  text: z.string().min(10).max(150),
});

export type CommentFormData = z.infer<typeof commentSchema>;
