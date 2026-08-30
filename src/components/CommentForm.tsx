"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { addComment, Post } from "../api/postsAPI";
import { toast } from "sonner";
import SendIcon from "./icons/SendIcon";
import { useRouter } from "next/navigation";
import { Comment } from "../api/commentsAPI"

export default function CommentForm({ post, comment, className, placeholder = true, charValid = true, reply = false}: { post?: Post, comment?: Comment, className?: string, placeholder?: boolean, charValid?: boolean, reply?: boolean}) {
  const {
    register,
    handleSubmit,
    formState: { isValid },
    setValue, 
    watch,
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    mode: "onTouched",
  });
  const router = useRouter()
  const text = watch("text", "");

  const onSubmit = async ({ text }: CommentFormData) => {
    let result;
    // if (reply) {
      // result =
    // } else {
      result = await addComment(post!.slug, text);
    // }
    if (result.status == 200) {
      router.refresh()
      setValue("text", "")
      return toast.success(result.message);
    }
    toast.error(result.message);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`mt-4 ${className}`}>
      <div className="flex w-full">
        <textarea {...register("text")} placeholder={placeholder ? "Enter your comment here" : ""} className="lg:w-[55vw] w-full rounded-e-none!" />
        <button className="border-y border-e border-s-0 rounded-s-none" disabled={!isValid}>
          <SendIcon className="size-6"/>
        </button>
      </div>
      {charValid && <p className={`${isValid && "dark:text-green-400! text-green-700!"} error-msg text-end`}>{text.length}/150 chars (min. 10)</p>}
    </form>
  );
}

export const commentSchema = z.object({
  text: z.string().min(10).max(150),
});

export type CommentFormData = z.infer<typeof commentSchema>;
