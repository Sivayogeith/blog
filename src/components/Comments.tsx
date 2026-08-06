import { formatDistance } from "date-fns";
import { Post } from "../api/helper";
import { getComments } from "../api/postsAPI";
import CommentForm from "./CommentForm";
import { getMe } from "../api/authAPI";

export default async function Comments({ post }: { post: Post }) {
  const comments = await getComments(post.slug);
  const session = await getMe();

  return (
    <>
      <div className="relative">
        <div
          className={`absolute z-10 inset-0 flex justify-center pt-5 text-xl ${session.username && "hidden"}`}
        >
          <p>
            <a href="/register" className="dark:text-light text-dark">
              Register
            </a>
            {" "}or{" "}
            <a href="/login" className="dark:text-light text-dark">
              Login
            </a>{" "}
            to make a comment!
          </p>
        </div>
        <CommentForm
          post={post}
          className={` ${!session.username && "brightness-40"}`}
          placeholder={!!session.username}
          charValid={!!session.username}
        />
      </div>
      <p className="text-xl font-bold mt-4">Comments</p>
      <div className="mt-1 ms-2">
        {comments.map((comment) => (
          <div className="mb-4" key={comment.id}>
            <div className="flex gap-1 itms-center">
              <img
                src={comment.image}
                className="size-7 rounded-full me-1 mt-0.5"
              />
              <div>
                <div className="flex gap-1 items-center">
                  <a
                    className="text-lg font-bold"
                    href={`/user/${comment.from}`}
                  >
                    @{comment.from}
                  </a>
                  <span className="text-sm">
                    •{" "}
                    {formatDistance(comment.created_at, Date.now(), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <p className="text-lg ms-1">{comment.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
