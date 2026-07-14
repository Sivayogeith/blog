"use server";

import { remark } from "remark";
import html from "remark-html";

export interface Post {
  id: number;
  title: string;
  body: string;
  created_at: Date;
  slug: string;
  stats: {
    readingTime: number;
    words: number;
  };
  image?: string;
}

const processPost = async (
  post: Post,
  truncate: boolean = false,
): Promise<Post> => {
  return {
    ...post,
    body: truncate ? post.body.split("<!-- truncate -->")[0] : post.body,
    created_at: new Date(post.created_at),
  };
};

export const getPosts = async (truncate: boolean = true): Promise<Post[]> => {
  let response = await fetch(`${process.env.API}/posts`);
  if (response.status == 200) {
    let posts: Post[] = await response.json();
    return await Promise.all(posts.map((post) => processPost(post, truncate)));
  }
  console.log(response.text());
  return [] as Post[];
};

export const getPost = async (slug: string): Promise<Post> => {
  let response = await fetch(`${process.env.API}/posts/${slug}`);
  if (response.status == 200) {
    let post: Post = await response.json();
    return await processPost(post);
  }
  console.log(await response.text());
  return {} as Post;
};
