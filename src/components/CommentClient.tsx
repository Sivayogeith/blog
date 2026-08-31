"use client";

import { formatDistance } from "date-fns";
import {
  Comment,
  deleteComment,
  dislikeComment,
  editComment,
  likeComment,
  removeOpinion,
  reportComment,
} from "../api/commentsAPI";
import { SessionData } from "../api/authAPI";
import DeleteIcon from "./icons/DeleteIcon";
import EditIcon from "./icons/EditIcon";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import CommentForm, { CommentFormElement, commentSchema } from "./CommentForm";
import { zodResolver } from "@hookform/resolvers/zod";
import LikeIcon from "./icons/LikeIcon";
import DislikeIcon from "./icons/DislikeIcon";
import ReportIcon from "./icons/ReportIcon";
import ReplyIcon from "./icons/ReplyIcon";

export default function CommentClient({
  comments,
  session,
}: {
  comments: Comment[];
  session: SessionData;
}) {
  return (
    <div className="mt-1 ms-2">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          comments={comments}
          session={session}
        />
      ))}
    </div>
  );
}

function CommentItem({
  comment,
  comments,
  session,
}: {
  comment: Comment;
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

  const message = watch("text");

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

  const onLike = async (commentId: number, remove: boolean = false) => {
    const result = await (remove ? removeOpinion : likeComment)(commentId);
    if (result.status == 200) {
      return router.refresh();
    }
    toast.error(result.message);
  };

  const onDislike = async (commentId: number, remove: boolean = false) => {
    const result = await (remove ? removeOpinion : dislikeComment)(commentId);
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

  const getReplies = (commentId: number) => {
    return comments.filter((comment) => comment.parent == commentId);
  };

  const formRef = useRef<CommentFormElement>(null);
  const replies = getReplies(comment.id);
  return (
    comment.parent == null && (
      <div className="mb-4">
        <div className="flex gap-1 w-full">
          <img
            src={comment.image}
            className="size-7 rounded-full me-1 mt-0.5"
          />
          <div className="w-full">
            <div className="flex items-center justify-between">
              <div className="flex gap-1 items-center">
                <a className="text-lg font-bold" href={`/user/${comment.from}`}>
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
                <hr className="w-full border-secondary border-1/2" />
              </div>
            ) : (
              <p className="text-lg ms-1">{comment.message}</p>
            )}
            <div className="flex items-center mt-1">
              <button
                className="border-0! p-0! ms-1"
                type="button"
                onClick={() =>
                  onLike(comment.id, comment.likes.includes(session.username))
                }
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
                onClick={() =>
                  onDislike(
                    comment.id,
                    comment.dislikes.includes(session.username),
                  )
                }
              >
                <DislikeIcon
                  className="size-5"
                  filled={comment.dislikes.includes(session.username)}
                />
              </button>
              <span className="ms-1">{comment.dislikes.length}</span>
              <button
                className="border-0! p-0! ms-2 flex items-center gap-1"
                onClick={() => formRef.current?.setShow(true)}
                type="button"
              >
                <ReplyIcon className="size-5" />
                <span className="text-sm"> Reply</span>
              </button>
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
            <CommentForm comment={comment} ref={formRef} reply className="ms-3" />
            {replies.length ? (
              <div className="ms-3">
                <hr className="border-secondary mt-3 mb-3" />
                {replies.map((reply) => (
                  <div className="flex gap-1 w-full mb-3" key={reply.id}>
                    <img
                      src={reply.image}
                      className="size-7 rounded-full me-1 mt-0.5"
                    />
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1 items-center">
                          <a
                            className="text-lg font-bold"
                            href={`/user/${reply.from}`}
                          >
                            @{reply.from}
                          </a>
                          <span className="text-sm">
                            •{" "}
                            {formatDistance(reply.created_at, Date.now(), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                      <p className="text-lg ms-1">{reply.message}</p>
                      <div className="flex items-center mt-1">
                        <button
                          className="border-0! p-0! ms-1"
                          type="button"
                          onClick={() =>
                            onLike(
                              reply.id,
                              reply.likes.includes(session.username),
                            )
                          }
                        >
                          <LikeIcon
                            className="size-5"
                            filled={reply.likes.includes(session.username)}
                          />
                        </button>
                        <span className="ms-1">{reply.likes.length}</span>
                        <button
                          className="border-0! p-0! ms-4"
                          type="button"
                          onClick={() =>
                            onDislike(
                              reply.id,
                              reply.likes.includes(session.username),
                            )
                          }
                        >
                          <DislikeIcon
                            className="size-5"
                            filled={reply.dislikes.includes(session.username)}
                          />
                        </button>
                        <span className="ms-1">{reply.dislikes.length}</span>
                        <div className="w-0 h-6 border-[0.5] border-secondary mx-2"></div>
                        {reply.from == session.username ? (
                          <>
                            {/* <button
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
                                      </button> */}
                          </>
                        ) : (
                          <button
                            className="border-0! p-0!"
                            onClick={() => onReport(reply.id)}
                          >
                            <ReportIcon className="size-5 dark:text-red-400 text-red-700" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    )
  );
}
