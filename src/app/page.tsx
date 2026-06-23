import { getPosts, Post } from "../api/postsAPI";
import PostItem from "../components/PostItem";

export default async function Home() {
  const posts: Post[] = await getPosts();

  return (
    <div className="flex flex-col flex-1 items-center">
      {posts.map(async (post: Post) => (
        <PostItem post={post}/>
      ))}
    </div>
  );
}
