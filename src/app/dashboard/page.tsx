import Image from "next/image";
import { notFound } from "next/navigation";
import { getMe } from "../../api/authAPI";
import { getPosts, Post } from "../../api/postsAPI";

import PlusIcon from "@/src/components/icons/PlusIcon";
import DeleteButton from "@/src/components/DeleteButton";
import EditIcon from "@/src/components/icons/EditIcon";
import {
  convertDateToString,
  convertMinutesToString,
} from "@/src/utils/postUtils";
import { getStats } from "@/src/api/adminAPI";

export default async function Dashboard() {
  const session = await getMe();
  const posts = await getPosts();
  const stats = await getStats();
  const authenticated = !!session.username;

  if (!authenticated) {
    return notFound();
  }
  return (
    <>
      <div className="flex flex-col flex-1 items-center">
        <div className="m-5 md:w-[95vw] w-[90vw] h-full flex justify-between flex-col">
          <p className="text-2xl">Stats</p>
          <hr className="dark:text-lightest text-dark" />
        </div>
        <div className="grid grid-cols-3 w-full">
          <div className="flex flex-col text-center">
            <p>Number of Posts</p>
            <span className="text-4xl">{posts.length}</span>
          </div>
          <div className="flex flex-col text-center">
            <p>Total Read</p>
            <span className="text-4xl">
              {convertMinutesToString(stats?.readingTime || 0, true)}
            </span>
          </div>
          <div className="flex flex-col text-center">
            <p>Total Words</p>
            <span className="text-4xl">{stats?.words || 0}</span>
          </div>
        </div>
        <div className="m-5 md:w-[95vw] w-[90vw] h-full flex justify-between flex-col">
          <div className="flex justify-between items-center mb-5">
            <p className="text-2xl">Posts</p>
            <a
              className="border dark:border-secondary border-dark p-1 rounded-lg"
              href="/post/create"
            >
              <PlusIcon className="dark:text-secondary text-dark text-2xl" />
            </a>
          </div>
          <hr className="dark:text-lightest text-dark" />
        </div>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 w-[95vw]">
          {posts.map(async (post: Post) => (
            <div
              key={post.id}
              className={`m-3 border border-secondary rounded-xl dark:bg-darker bg-lightest`}
            >
              <div className="flex flex-col items-center mb-3">
                <a
                  className="text-2xl font-semibold mt-5 text-center"
                  href={`/post/${post.slug}`}
                >
                  {post.title}
                </a>
                <Image
                  src="/cats.png"
                  alt="cats"
                  width={500}
                  height={500}
                  loading="eager"
                  className="border border-secondary rounded-xl max-w-40 max-h-30 w-auto my-2"
                />
                <p>
                  {convertDateToString(post.created_at)} •{" "}
                  {convertMinutesToString(post.stats.readingTime)} •{" "}
                  {post.stats.words} words
                </p>
              </div>
              <div
                className="text-md body h-20 mx-5 text-ellipsis overflow-hidden"
                dangerouslySetInnerHTML={{ __html: post.body }}
              />
              <div className="pt-4 flex">
                <a
                  className="adminBtn rounded-bl-xl"
                  href={`/post/${post.slug}/edit`}
                >
                  <EditIcon className="size-6" />
                  Edit
                </a>
                <DeleteButton id={post.id} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
