import { remark } from "remark";
import html from "remark-html";

export interface RawPost {
  id: number;
  title: string;
  body: string;
  created_at: string;
  slug: string;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  created_at: Date;
  slug: string;
  readingTime: string;
}

const processPost = async (post: RawPost, truncate: boolean = false): Promise<Post> => {
  const readingTime = calculateReadingTime(post.body)
  const body = truncate ? post.body.split("<!-- truncate -->")[0] : post.body
  const bodyHTML = await remark().use(html, { allowDangerousHtml: true }).process(body);
  return {...post, body: bodyHTML.toString(), created_at: new Date(post.created_at), readingTime};
};

export const convertDateToString = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const calculateReadingTime = (text: string) => {
  const wordsPerMinute = 225
  const noOfWords = text.split(/\s/g).length
  const minutes = noOfWords / wordsPerMinute
  const readTime = Math.ceil(minutes)
  return `${readTime} minute read`
}

export const getPosts = async (): Promise<Post[]> => {
  let response = await fetch(`${process.env.API}/posts`);
  if (response.status == 200) {
    let posts: RawPost[] = await response.json();
    return await Promise.all(
      posts.map((post) => processPost(post, true))
    );
  }
  console.error(response.text())
  return [] as Post[]
};

export const getPost = async (slug: string): Promise<Post> => {
  let response = await fetch(`${process.env.API}/posts/${slug}`);
  if (response.status == 200){
    let post: RawPost = await response.json();
    return await processPost(post);
  }
  console.log(await response.text())
  return {} as Post
};
