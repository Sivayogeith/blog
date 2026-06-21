import { notFound } from "next/navigation";
import { getMe } from "../../api/authAPI";
import { getPosts, Post } from "../../api/postsAPI";
import { convertDateToString } from "@/src/utils/postUtils";

import Image from "next/image";
import PlusIcon from "@/src/components/PlusIcon";
import DeleteButton from "@/src/components/DeleteButton";

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
          <hr className="text-lightest mb-10" />
          {posts.map(async (post: Post) => (
            <div
              key={post.id}
              className="p-10 h-full border border-secondary rounded-2xl flex justify-between lg:flex-row flex-col-reverse gap-10 mb-5"
            >
              <div className="lg:w-3/4">
                <a
                  className="text-4xl font-semibold"
                  href={`/post/${post.slug}`}
                >
                  {post.title}
                </a>
                <p className="mb-5">
                  {convertDateToString(post.created_at)} • {post.readingTime}
                </p>

                <div
                  className="lg:text-xl md:text-lg text-sm body-preview"
                  dangerouslySetInnerHTML={{ __html: post.body }}
                />
                <div className="pt-4 flex gap-2">
                  <a className="border border-secondary bg-pale-dark px-5 py-2 rounded-lg" 
                  href={`/post/${post.slug}/edit`}
                  >
                    Edit
                  </a>
                  <DeleteButton id={post.id}/>
                </div>
              </div>
              <Image
                src="/cats.png"
                alt="cats"
                width={500}
                height={500}
                className="rounded-xl lg:w-[40%] w-full h-full"
                loading="eager"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
