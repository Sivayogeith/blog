import { notFound } from "next/navigation";

import { getPost } from "../../../api/postsAPI";
import {
  convertDateToString,
  convertMinutesToString,
} from "@/src/utils/postUtils";

import Markdown from "@/src/components/Markdown";
import PostCover from "@/src/components/PostCover";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post.title) {
    return notFound();
  }

  return (
    <div className="flex flex-col flex-1">
      <div
        key={post.id}
        className="my-10 w-full rounded-2xl flex flex-col items-center"
      >
        <div className="text-start lg:w-[55vw] lg:p-0 w-full px-5">
          <h2 className="md:text-5xl text-4xl font-semibold mb-1">
            {post.title}
          </h2>
          <p className="mb-5">
            {post.created_at &&
              post.stats.readingTime &&
              `${convertDateToString(post.created_at)} • ${convertMinutesToString(post.stats?.readingTime)}`}
          </p>
          <PostCover
            post={post}
            className="rounded-xl mb-5"
            coverProps={{className: "w-full h-auto"}}
            parentsParent
            spinner
          />
          <Markdown source={post.body} />
        </div>
      </div>
    </div>
  );
}
