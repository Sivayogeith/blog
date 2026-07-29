import { Post } from "../api/helper";
import { getComments } from "../api/postsAPI";

export default async function Comments({ post }: { post: Post }) {
  const comments = await getComments(post.slug);

  return (
    <div className="mt-1">
      {comments.map((comment) => (
        <div className="mb-4" key={comment.id}>
          <a className="text-lg font-bold" href={`/user/${comment.from}`}>@{comment.from}</a>
          <p className="text-lg">{comment.message}</p>
        </div>
      ))}
    </div>
  );
}
