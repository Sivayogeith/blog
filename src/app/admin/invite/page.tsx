"use client";

import { respondInvite } from "@/src/api/adminAPI";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RespondInvite() {
  const router = useRouter();

  const onRespond = async (accept: boolean) => {
    toast.promise(respondInvite(accept), {
      loading: "Responding...",
      success: ({ message, status }) => {
        setTimeout(() =>
          router.push(
            status !== 200 || !accept ? "/" : "/admin/dashboard",
          ),
        );
        return { type: status == 200 ? "success" : "error", message };
      },
    });
  };
  return (
    <div className="flex items-center justify-center h-[92vh] w-full">
      <div className="flex flex-col w-[30%] items-center border border-secondary p-10 rounded-sm">
        <h1 className="text-2xl">You have been invited to Admins!</h1>
        <div className="w-min">
          <p className="w-max">
            You have been invited to be part of this blog's Admin team!
          </p>
          <div className="text-start">
            <p>You can:</p>
            <ul className="list-disc ms-8">
              <li>Create/Edit/Delete Posts</li>
              <li>See The Blog's Statistics</li>
            </ul>
          </div>
        </div>
        <div className="flex gap-2 mt-8 w-full">
          <button
            className="p-2 bg-deep-light rounded-sm w-[50%]"
            onClick={() => onRespond(true)}
          >
            Accept
          </button>
          <button
            className="p-2 border border-secondary rounded-sm w-[50%]"
            onClick={() => onRespond(false)}
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
