"use client";

import { setSlackId } from "@/src/api/authAPI";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function HCAInternal() {
  const params = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState(
    "Do not refresh or close this page... Connecting with Hack Club Auth...",
  );

  useEffect(() => {
    const code = params.get("code");

    if (!code) {
      return setMessage("Please enter code query param!");
    }

    setSlackId(code as string).then(({ message, status }) => {
      if (status == 200) {
        router.push("/profile");
        return setMessage(message + " Please wait a second...");
      }
      setMessage(message);
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-[84vh]">
      <p className="text-xl">{message}</p>
    </div>
  );
}

export default function HCA() {
  return (
    <Suspense>
      <HCAInternal />
    </Suspense>
  );
}
