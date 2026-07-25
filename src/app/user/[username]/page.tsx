import { getUser } from "@/src/api/userAPI";
import Image from "next/image"
import { notFound } from "next/navigation";

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
    const { username } = await params
    const user = await getUser(username)
    if (!user.name) {
      return notFound()
    }

    return <>
        <div className="flex py-4 px-20 gap-5">
            <Image src={user.image || "/default-user.png"} alt={`${user.name}'s Profile Picture`} width={128} height={128} unoptimized className="rounded-full border dark:border-lighter border-dark"/>
            <div className="pt-2">
              <h1 className="text-5xl">{user.name}</h1>
              <p className="text-xl opacity-75">@{user.username}</p>
            </div>
        </div>
    </>
}
