"use client";

import { deletePost } from "@/app/api/adminAPI";
import { useRouter } from "next/navigation";

export default function DeleteButton(props: { id: number }) {
    const router = useRouter();
  return (
    <button
      className="border border-secondary bg-pale-dark px-5 py-2 rounded-lg"
      onClick={async () => {
        await deletePost(props.id);
        router.refresh();
      }}
    >
      Delete
    </button>
  );
}
