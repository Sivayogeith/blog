"use client";

import { getMe } from "@/src/api/authAPI";
import { User } from "@/src/api/helper";
import { getUser } from "@/src/api/userAPI";
import EditIcon from "@/src/components/icons/EditIcon";
import Spinner from "@/src/components/Spinner";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState({} as User);

  useEffect(() => {
    getMe().then((s) => getUser(s.username).then(setUser as any));
  }, []);

  return (
    <div className="flex justify-center px-2">
      <div
        className={`border-[0.5] border-secondary md:w-[70%] w-full h-[88dvh] pt-10 mt-6 md:px-15 px-5 rounded-sm ${!user.username && "flex justify-center items-center pt-0"}`}
      >
        {user.username ? (
          <>
            <div className="flex justify-between pb-8">
              <div className="flex gap-5">
                <Image
                  src={user.image || "/default-user.png"}
                  alt={`${user.name}'s Profile Picture`}
                  width={128}
                  height={128}
                  loading="eager"
                  unoptimized
                  className="rounded-full border dark:border-lighter border-dark size-25"
                />
                <div className="pt-2">
                  <h1 className="text-3xl">{user.name}</h1>
                  <p className="text-xl opacity-75">@{user.username}</p>
                </div>
              </div>
              <a
                className="opacity-85 pt-2 flex gap-1 items-center h-min hover:dark:text-lightest hover:text-dark text-lg"
                href="/profile/edit"
              >
                <EditIcon /> edit
              </a>
            </div>
            <div className="border-[0.5] border-secondary w-full flex h-20 rounded-sm justify-between px-5 items-center">
              <div className="flex gap-2 items-center">
                <img
                  src="https://assets.hackclub.com/icon-square.svg"
                  className="size-10 rounded-sm"
                />
                <div>
                  <p className="text-lg">Hack Club Auth</p>
                  <p className="text-sm opacity-80">Not Connected</p>
                </div>
              </div>
              <button
                className="border border-secondary rounded-sm p-1"
                onClick={() =>
                  alert(
                    "sorry! hackclub auth is WIP - check for updates: #sage-meows",
                  )
                }
              >
                Connect
              </button>
            </div>
          </>
        ) : (
          <Spinner size={128} />
        )}
      </div>
    </div>
  );
}
