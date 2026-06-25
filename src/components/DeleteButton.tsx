"use client";

import { deletePost } from "@/src/api/adminAPI";
import { useRouter } from "next/navigation";

export default function DeleteButton(props: { id: number }) {
    const router = useRouter();
  return (
    <button
      className="adminBtn rounded-br-xl"
      onClick={async () => {
        await deletePost(props.id);
        router.refresh();
      }}
    >
      Delete
    </button>
  );
}
