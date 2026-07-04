"use client";

import { deletePost } from "@/src/api/adminAPI";
import { useRouter } from "nextjs-toploader/app";
import DeleteIcon from "./icons/DeleteIcon";

export default function DeleteButton(props: { id: number }) {
    const router = useRouter();
  return (
    <button
      className="adminBtn rounded-br-xl dark:text-red-600 text-red-800 border-l"
      onClick={async () => {
        await deletePost(props.id);
        router.refresh();
      }}
    >
      <DeleteIcon className="size-6 text-red"/>
      Delete
    </button>
  );
}
