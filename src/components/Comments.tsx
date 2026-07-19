import { Post } from "../api/helper";
import { getComments } from "../api/postsAPI";

export default async function Comments({ post }: { post: Post }) {
  const comments = await getComments(post.id);

  return (
    <div className="mt-1">
      {comments.map((comment) => (
        <div className="mb-4" key={comment.id}>
          <h4 className="text-lg font-bold">@{comment.from}</h4>
          <p className="text-lg">{comment.message}</p>
        </div>
      ))}
    </div>
  );
}
