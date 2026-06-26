import { notFound } from "next/navigation";
import { getMe } from "../../api/authAPI";
import { getPosts, Post } from "../../api/postsAPI";
import Image from "next/image";

import PlusIcon from "@/src/components/icons/PlusIcon";
import DeleteButton from "@/src/components/DeleteButton";
import { convertDateToString } from "@/src/utils/postUtils";
import PostPageImage from "@/src/components/PostPageImage";
import EditIcon from "@/src/components/icons/EditIcon";

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
        <div className="m-5 w-[95vw] h-full flex justify-between flex-col">
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
              <div className="flex flex-col items-center">
                <a
                  className="text-2xl font-semibold mt-5"
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
                  className="border border-secondary m-4 rounded-xl max-w-40 max-h-30 w-auto"
                />
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
                  <EditIcon className="size-6"/>
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
