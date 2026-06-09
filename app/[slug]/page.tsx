import Image from "next/image";
import { convertDateToString, getPost, Post } from "../postsAPI";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post: Post = await getPost(slug);

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-[#000217]">
      <div className="text-3xl text-center p-5">
        <a href="/">Sage's Blog</a>
      </div>

      <div
        key={post.id}
        className="my-10 w-full rounded-2xl flex flex-col items-center"
      >
        <div className="text-start md:w-[55vw] md:p-0 w-full px-5">
          <Image
            src="/cats.png"
            alt="cats"
            width={500}
            height={500}
            className="rounded-xl w-full h-auto mb-5"
          />
          <h2 className="text-4xl font-semibold">{post.title}</h2>
          <p className="mb-5">
            {convertDateToString(post.created_at)} • {post.readingTime}
          </p>
          <div
            className="md:text-xl text-md body"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
        </div>
      </div>
    </div>
  );
}
