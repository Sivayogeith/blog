import { getPost, Post } from "../../../api/postsAPI";
import { convertDateToString } from "@/src/utils/postUtils";
import { notFound } from "next/navigation";
import PostPageImage from "@/src/components/PostPageImage";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post: Post = await getPost(slug);

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
          <PostPageImage />
          <h2 className="text-4xl font-semibold">{post.title}</h2>
          <p className="mb-5">
            {convertDateToString(post.created_at)} • {post.stats.readingTime}
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
