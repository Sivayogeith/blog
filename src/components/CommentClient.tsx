"use client";

import { formatDistance } from "date-fns";
import {
  Comment,
  deleteComment,
  dislikeComment,
  editComment,
  likeComment,
  reportComment,
} from "../api/commentsAPI";
import { SessionData } from "../api/authAPI";
import DeleteIcon from "./icons/DeleteIcon";
import EditIcon from "./icons/EditIcon";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { commentSchema } from "./CommentForm";
import { zodResolver } from "@hookform/resolvers/zod";
import LikeIcon from "./icons/LikeIcon";
import DislikeIcon from "./icons/DislikeIcon";
import ReportIcon from "./icons/ReportIcon";

export default function CommentClient({
  comments,
  session,
}: {
  comments: Comment[];
  session: SessionData;
}) {
  const router = useRouter();
  const [edit, setEdit] = useState<number | null>(null);
  const {
    register,
    getValues,
    setValue,
    watch,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(commentSchema),
    mode: "onTouched",
  });

  const message = watch("text")

  const onEdit = async (commentId: number) => {
    toast.promise(editComment(commentId, message), {
      loading: "Editing...",
      success: ({ message, status }) => {
        setEdit(null);
        if (status == 200) {
          router.refresh();
        }
        return { type: status == 200 ? "success" : "error", message };
      },
    });
  };

  const onDelete = async (commentId: number) => {
    toast.promise(deleteComment(commentId), {
      loading: "Deleting comment...",
      success: ({ message, status }) => {
        if (status == 200) {
          router.refresh();
        }
        return { type: status == 200 ? "success" : "error", message };
      },
    });
  };

  const onLike = async (commentId: number) => {
    const result = await likeComment(commentId);
    if (result.status == 200) {
      return router.refresh();
    }
    toast.error(result.message);
  };

  const onDislike = async (commentId: number) => {
    const result = await dislikeComment(commentId);
    if (result.status == 200) {
      return router.refresh();
    }
    toast.error(result.message);
  };

  const onReport = async (commentId: number) => {
    toast.promise(reportComment(commentId), {
      loading: "Reporting...",
      success: ({ message, status }) => {
        return { type: status == 200 ? "success" : "error", message };
      },
    });
  };

  return (
    <>
      <div className="mt-1 ms-2">
        {comments.map((comment) => (
          <div className="mb-4" key={comment.id}>
            <div className="flex gap-1 w-full">
              <img
                src={comment.image}
                className="size-7 rounded-full me-1 mt-0.5"
              />
              <form className="w-full">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 items-center">
                    <a
                      className="text-lg font-bold"
                      href={`/user/${comment.from}`}
                    >
                      @{comment.from}
                    </a>
                    <span className="text-sm">
                      •{" "}
                      {formatDistance(comment.created_at, Date.now(), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
                {edit == comment.id ? (
                  <div className="w-[98%] flex flex-col mt-1 items-end mb-2">
                    <textarea {...register("text")} className="w-full" />
                    <div className="flex gap-3 items-center justify-between w-full">
                      <p
                        className={`${isValid && "dark:text-green-400! text-green-700!"} error-msg text-end`}
                      >
                        {message.length}/150 chars (min. 10)
                      </p>
                      <button
                        className="border-0! p-0! mt-1"
                        onClick={() => onEdit(comment.id)}
                        type="button"
                        disabled={!isValid}
                      >
                        save
                      </button>
                    </div>
                    <hr className="w-full border-secondary border-1/2"/>
                  </div>
                ) : (
                  <p className="text-lg ms-1">{comment.message}</p>
                )}
                <div className="flex items-center mt-1">
                  <button
                    className="border-0! p-0! ms-1"
                    type="button"
                    onClick={() => onLike(comment.id)}
                  >
                    <LikeIcon
                      className="size-5"
                      filled={comment.likes.includes(session.username)}
                    />
                  </button>
                  <span className="ms-1">{comment.likes.length}</span>
                  <button
                    className="border-0! p-0! ms-4"
                    type="button"
                    onClick={() => onDislike(comment.id)}
                  >
                    <DislikeIcon
                      className="size-5"
                      filled={comment.dislikes.includes(session.username)}
                    />
                  </button>
                  <span className="ms-1">{comment.dislikes.length}</span>
                  <div className="w-0 h-6 border-[0.5] border-secondary mx-2"></div>
                  {comment.from == session.username ? (
                    <>
                      <button
                        className="border-0! p-0!"
                        onClick={() => {
                          setEdit(comment.id);
                          setValue("text", comment.message);
                        }}
                        type="button"
                      >
                        <EditIcon className="size-4.5" />
                      </button>
                      <button
                        className="border-0! p-0! ms-2"
                        onClick={() => onDelete(comment.id)}
                        type="button"
                      >
                        <DeleteIcon className="size-5 dark:text-red-400 text-red-700" />
                      </button>
                    </>
                  ) : (
                    <button
                      className="border-0! p-0!"
                      onClick={() => onReport(comment.id)}
                    >
                      <ReportIcon className="size-5 dark:text-red-400 text-red-700" />
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
