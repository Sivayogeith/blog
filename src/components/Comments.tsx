import { Post } from "../api/helper";
import { getComments } from "../api/postsAPI";
import CommentForm from "./CommentForm";
import { getMe } from "../api/authAPI";
import CommentClient from "./CommentClient";

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
            </a>{" "}
            or{" "}
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
      <CommentClient comments={comments} session={session}/>
    </>
  );
}
