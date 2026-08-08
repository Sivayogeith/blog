"use client";

import { getMe, SessionData } from "@/src/api/authAPI";
import { User } from "@/src/api/helper";
import { addAdmin, getUsers } from "@/src/api/ownerAPI";
import Spinner from "@/src/components/Spinner";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Users() {
  const [users, setUsers] = useState<(User & { id: number })[]>();
  const [session, setSession] = useState<SessionData>();

  const makeAdmin = async (username: string) => {
    toast(`Are you sure you want to make ${username} an Admin?`, {
      action: {
        label: "Confirm",
        onClick: () => {
          toast.promise(addAdmin(username), {
            loading: "Admining...",
            success: ({ message, status }) => {
              getUsers().then(setUsers as any);
              return { type: status == 200 ? "success" : "error", message };
            },
          });
        },
      },
      classNames: {
        actionButton: "bg-deep-light text-white rounded-sm p-1",
        toast: "w-max! gap-5!",
      },
      duration: Infinity,
    });
  };

  useEffect(() => {
    getUsers().then(setUsers as any);
    getMe().then(setSession as any);
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="m-5 md:w-[95vw] w-[90vw] h-full flex justify-between flex-col">
        <p className="text-2xl">All Users</p>
        <hr className="dark:text-lightest text-dark" />
      </div>
      <div className="px-10 w-full">
        {session && users ? (
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Username</th>
                <th>Image</th>
                <th>Admin?</th>
                <th>Owner?</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <a
                      href={`/user/${user.username}`}
                      className="dark:text-lighter text-dark"
                    >
                      #{user.id}
                    </a>
                  </td>
                  <td>
                    {user.name}{" "}
                    <span className="font-semibold">
                      {user.username == session.username && "(you)"}
                    </span>
                  </td>
                  <td>{user.username}</td>
                  <td className="flex justify-center">
                    <img className="size-10 rounded-full" src={user.image} />
                  </td>
                  <td className="w-50! px-2!">
                    <div className="flex justify-between items-center">
                      {user.isAdmin ? "Yes" : "No"}
                      {!user.isAdmin && (
                        <button
                          className="bg-deep-light text-white rounded-sm p-1"
                          onClick={() => makeAdmin(user.username)}
                        >
                          Make Admin
                        </button>
                      )}
                    </div>
                  </td>
                  <td>{user.isOwner ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex justify-center items-center w-full py-30">
            <Spinner size={128} />
          </div>
        )}
      </div>
    </div>
  );
}
