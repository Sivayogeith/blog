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
        data-loaded={!post.cover}
        className="my-10 w-full rounded-2xl flex flex-col items-center animated-post-div"
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
            className="rounded-xl w-full h-auto mb-5 bg-darker"
            parentsParent
          />
          <Markdown source={post.body} />
        </div>
      </div>
    </div>
  );
}
