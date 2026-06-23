import { notFound } from "next/navigation";
import { getMe } from "../../api/authAPI";
import { getPosts, Post } from "../../api/postsAPI";

import PlusIcon from "@/src/components/icons/PlusIcon";
import PostItem from "@/src/components/PostItem";

export default async function Dashboard() {
  const session = await getMe();
  const posts = await getPosts();
  const authenticated = !!session.username;

  if (!authenticated) {
    return notFound();
  }
  return (
    <>
      <div className="flex flex-col flex-1 items-center">
        <div className="my-5 mx-10 lg:w-[80vw] w-[90vw] h-full flex justify-between flex-col">
          <div className="flex justify-between items-center mb-5">
            <p className="text-2xl">Posts</p>
            <a
              className="border border-secondary p-1 rounded-lg"
              href="/post/create"
            >
              <PlusIcon className="text-secondary text-2xl" />
            </a>
          </div>
          <hr className="text-lightest" />
        </div>
        {posts.map(async (post: Post) => (
          <PostItem post={post} admin={true} />
        ))}
      </div>
    </>
  );
}
