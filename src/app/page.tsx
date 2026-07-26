import { getPosts, Post } from "../api/postsAPI";
import Markdown from "../components/Markdown";
import PostCover from "../components/PostCover";
import {
  convertDateToString,
  convertMinutesToString,
} from "../utils/postUtils";

export default async function Home() {
  const posts: Post[] = await getPosts();

  return (
    <div className="flex flex-col flex-1 items-center">
      {posts.map(async (post: Post) => (
        <div
          key={post.id}
          data-loaded={!post.cover}
          className={`p-10 my-5 mx-10 lg:w-[80vw] w-[90vw] h-full border border-secondary rounded-2xl flex justify-between lg:flex-row flex-col-reverse gap-10 dark:bg-darker bg-lightest`}
        >
          <div className="lg:w-3/4">
            <a className="text-4xl font-semibold" href={`/post/${post.slug}`}>
              {post.title}
            </a>
            <p className="mb-5">
              <a href={`/user/${post.author}`} className="dark:text-lighter text-dark">{post.author}</a> {` • ${convertDateToString(post.created_at)} • ${convertMinutesToString(post.stats.readingTime)}`}
            </p>

            <Markdown source={post.body} class="body-preview" />
          </div>
          <PostCover
            post={post}
            className="rounded-xl w-auto h-min"
            coverProps={{ className: "w-auto max-h-80" }}
          />
        </div>
      ))}
    </div>
  );
}
