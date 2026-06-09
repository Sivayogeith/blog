import Image from "next/image";
import {
  convertDateToString,
  getPosts,
  Post,
} from "./postsAPI";

export default async function Home() {
  const posts: Post[] = await getPosts();

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 dark:bg-[#000217]">
      <div className="text-3xl text-center p-5">
        <a href="/">Sage's Blog</a>
      </div>
      {posts.map(async (post: Post) => (
        <div
          key={post.id}
          className="p-10 my-5 mx-10 lg:w-[80vw] w-[90vw] h-full border rounded-2xl flex justify-between lg:flex-row flex-col-reverse gap-10"
        >
          <div className="lg:w-3/4">
            <a className="text-4xl font-semibold" href={`/${post.slug}`}>
              {post.title}
            </a>
            <p className="mb-5">
              {convertDateToString(post.created_at)} •{" "}
              {post.readingTime}
            </p>

            <div
              className="lg:text-xl md:text-lg text-sm body-preview"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          </div>
          <Image
            src="/cats.png"
            alt="cats"
            width={500}
            height={500}
            className="rounded-xl lg:w-[40%] w-full h-full"
          />
        </div>
      ))}
    </div>
  );
}
