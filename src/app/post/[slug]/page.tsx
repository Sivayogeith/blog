import { notFound } from "next/navigation";

import { getPost } from "../../../api/postsAPI";
import {
  convertDateToString,
  convertMinutesToString,
} from "@/src/utils/postUtils";

import Markdown from "@/src/components/Markdown";
import PostCover from "@/src/components/PostCover";
import Comments from "@/src/components/Comments";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  let metadata: Metadata = {
    title: post.title || "404 Post Not Found",
    description: `The page for blog post #${post.id} ${post.title} by ${post.author} | ${convertDateToString(post.created_at)}`,
  };

  if (post.cover?.src) {
    metadata.openGraph = { [post.cover.type == "image" ? "images" : "videos"] : post.cover.src };
  }

  return metadata;
}

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
          <p className="mb-2">
            {post.created_at && post.stats.readingTime && (
              <>
                <a
                  href={`/user/${post.author}`}
                  className="dark:text-lighter text-dark"
                >
                  {post.author}
                </a>{" "}
                • {convertDateToString(post.created_at)} •{" "}
                {convertMinutesToString(post.stats?.readingTime)}
              </>
            )}
          </p>
          <div className="flex justify-center">
            <PostCover
              post={post}
              className="rounded-xl mb-3 mt-3 w-max max-h-full"
              coverProps={{ className: "h-[inherit]" }}
            />
          </div>
          {post.cover?.caption && (
            <Markdown
              class="text-sm! mb-1 text-center opacity-70"
              source={post.cover?.caption}
            />
          )}
          {(!post.cover || post.cover.caption) && (
            <hr className="mb-3 opacity-70" />
          )}
          <Markdown source={post.body} />
          <hr className="mb-5 mt-8 opacity-70" />
          <Comments post={post} />
        </div>
      </div>
    </div>
  );
}
