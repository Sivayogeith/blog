"use server"

import { remark } from "remark";
import html from "remark-html";
import { calculateReadingTime } from "../utils/postUtils";

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

const processPost = async (post: RawPost,  md: boolean = false, truncate: boolean = false): Promise<Post> => {
  const readingTime = calculateReadingTime(post.body)
  const body = truncate ? post.body.split("<!-- truncate -->")[0] : post.body
  const bodyHTML = md ? body : await remark().use(html, { allowDangerousHtml: true }).process(body);
  return {...post, body: bodyHTML.toString(), created_at: new Date(post.created_at), readingTime};
};

export const getPosts = async (): Promise<Post[]> => {
  let response = await fetch(`${process.env.API}/posts`);
  if (response.status == 200) {
    let posts: RawPost[] = await response.json();
    return await Promise.all(
      posts.map((post) => processPost(post, false, true))
    );
  }
  console.log(response.text())
  return [] as Post[]
};

export const getPost = async (slug: string, md: boolean = false): Promise<Post> => {
  let response = await fetch(`${process.env.API}/posts/${slug}`);
  if (response.status == 200){
    let post: RawPost = await response.json();
    return await processPost(post, md);
  }
  console.log(await response.text())
  return {} as Post
};
