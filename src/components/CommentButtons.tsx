"use client";

import DeleteIcon from "./icons/DeleteIcon";
import EditIcon from "./icons/EditIcon";
import { SessionData } from "../api/authAPI";
import { Comment } from "../api/commentsAPI";

export default function CommentButtons({
  comment,
  session,
}: {
  comment: Comment;
  session: SessionData;
}) {
  return (
    <>
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
    </>
  );
}
