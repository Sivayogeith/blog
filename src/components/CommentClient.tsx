"use client"

import { formatDistance } from "date-fns";
import { Comment } from "../api/commentsAPI";
import { SessionData } from "../api/authAPI";
import DeleteIcon from "./icons/DeleteIcon";
import EditIcon from "./icons/EditIcon";

export default function CommentClient({
  comments,
  session,
}: {
  comments: Comment[];
  session: SessionData;
}) {
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
              <div className="w-full">
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
                <p className="text-lg ms-1">{comment.message}</p>
              </div>
              {comment.from == session.username && (
                <div className="flex flex-col gap-4 items-center h-full">
                  <button className="border-0! p-0!">
                    <EditIcon className="size-4.5" />
                  </button>
                  <button className="border-0! p-0!">
                    <DeleteIcon className="size-5 dark:text-red-400 text-red-700" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
