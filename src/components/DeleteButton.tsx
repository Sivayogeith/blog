"use client";

import { deletePost } from "@/src/api/adminAPI";
import { useRouter } from "nextjs-toploader/app";
import DeleteIcon from "./icons/DeleteIcon";
import { toast } from "sonner";

export default function DeleteButton(props: { id: number }) {
  const router = useRouter();
  const onClick = () =>
    toast.error(`Are you sure?`, {
      action: {
        label: `Delete Post #${props.id}!`,
        onClick: async () => {
          await deletePost(props.id);
          toast.success(`Deleted Post #${props.id}!`);
          router.refresh();
        },
      },
      icon: <DeleteIcon />,
    });

  return (
    <button
      className="adminBtn rounded-br-xl dark:text-red-400 text-red-800 border-l"
      onClick={onClick}
    >
      <DeleteIcon className="size-6 text-red" />
      Delete
    </button>
  );
}
