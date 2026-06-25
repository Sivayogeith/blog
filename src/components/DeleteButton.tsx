"use client";

import { deletePost } from "@/src/api/adminAPI";
import { useRouter } from "next/navigation";
import DeleteIcon from "./icons/DeleteIcon";

export default function DeleteButton(props: { id: number }) {
    const router = useRouter();
  return (
    <button
      className="adminBtn rounded-br-xl dark:text-red-600 text-red-400"
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
