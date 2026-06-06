import Image from "next/image";
import { remark } from "remark";
import html from "remark-html";

const getPosts = async () => {
  let data = await fetch(`${process.env.API}/posts`);
  let posts: { id: number; title: string; body: string }[] = await data.json();
  posts.map(async (post) => {
    const bodyMD = await remark().use(html).process(post.body);
    const bodyHTML = bodyMD.toString();
    console.log(bodyHTML);
    post.body = bodyHTML;
  });

  return posts
}
export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 dark:bg-[#000217] py-10">
      <h1 className="text-5xl mb-5">Sage's Blog</h1>
      {posts.map(async (post) => (
        <div
          key={post.id}
          className="p-10 my-5 w-2/3 border rounded-2xl flex justify-between"
        >
          <div>
            <h2 className="text-3xl">{post.title}</h2>
            <div
              className="text-xl"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          </div>
          <Image
            src="/cats.png"
            alt="cats"
            width={500}
            height={500}
            className="rounded-xl"
          />
        </div>
      ))}
    </div>
  );
}
