import { Post } from "../api/postsAPI";

export const processPost = (post: Post, truncate: boolean = false): Post => {
  return {
    ...post,
    body: truncate ? post.body.split("<!-- truncate -->")[0] : post.body,
    created_at: new Date(post.created_at),
  };
};

export const convertDateToString = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const convertMinutesToString = (
  mins: number,
  compact: boolean = false,
) =>
  (mins < 60
    ? `${mins} ${compact ? "m" : "minute"}`
    : `${(mins / 60).toFixed(1)} ${compact ? "h" : "hour"}`) +
  (compact ? "" : " read");

export const calculateReadingTime = (text: string, string: boolean = false) => {
  const wordsPerMinute = 225;
  const minutes = calculateWordCount(text) / wordsPerMinute;
  const readTime = Math.ceil(minutes);
  return string ? convertMinutesToString(readTime) : readTime;
};

export const calculateWordCount = (text: string) => text.split(/\s+/).length;
