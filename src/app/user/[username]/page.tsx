import { getUser, getUserStats } from "@/src/api/userAPI";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await getUser(username);
  const stats = await getUserStats(username);
  if (!user.name) {
    return notFound();
  }

  return (
    <>
      <div className="flex py-4 ps-20 gap-5">
        <Image
          src={user.image || "/default-user.png"}
          alt={`${user.name}'s Profile Picture`}
          width={128}
          height={128}
          loading="eager"
          unoptimized
          className="rounded-full border dark:border-lighter border-dark"
        />
        <div className="pt-2">
          <h1 className="text-5xl">{user.name}</h1>
          <p className="text-xl opacity-75">@{user.username}</p>
        </div>
        <div className="w-[50%]"></div>
        <div className="flex gap-5 items-center justify-between w-[25%] pe-5 pt-2">
          <div>
            <p>Posts Authored</p>
            <p className="text-5xl mt-1 text-center">{stats.posts}</p>
          </div>
          <div>
            <p>Comments Made</p>
            <p className="text-5xl mt-1 text-center">{stats.comments}</p>
          </div>
        </div>
      </div>
    </>
  );
}
