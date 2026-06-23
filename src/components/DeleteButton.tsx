"use client";

import { deletePost } from "@/src/api/adminAPI";
import { useRouter } from "next/navigation";

export default function DeleteButton(props: { id: number }) {
    const router = useRouter();
  return (
    <button
      className="border border-secondary bg-linear-to-bl from-pale-dark to-dark px-5 py-2 rounded-lg lg:w-auto w-full"
      onClick={async () => {
        await deletePost(props.id);
        router.refresh();
      }}
    >
      Delete
    </button>
  );
}
