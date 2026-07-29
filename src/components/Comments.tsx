import { Post } from "../api/helper";
import { getComments } from "../api/postsAPI";
import CommentForm from "./CommentForm";

export default async function Comments({ post }: { post: Post }) {
  let comments = await getComments(post.slug);

  return (
    <>
      <CommentForm post={post}/>
      <p className="text-xl font-bold mt-4">Comments</p>
      <div className="mt-1">
        {comments.map((comment) => (
          <div className="mb-4" key={comment.id}>
            <a className="text-lg font-bold" href={`/user/${comment.from}`}>
              @{comment.from}
            </a>
            <p className="text-lg">{comment.message}</p>
          </div>
        ))}
      </div>
    </>
  );
}
