"use client";

import Image from "next/image";
import { useState } from "react";
import { Post } from "../api/postsAPI";
import { convertDateToString, convertMinutesToString } from "../utils/postUtils";

export default function PostItem(props: { post: Post }) {
  const { post } = props;
  const [loaded, setLoaded] = useState(post.image ? false : true);

  return (
    <>
      <div
        key={post.id}
        className={`p-10 my-5 mx-10 lg:w-[80vw] w-[90vw] h-full border border-secondary rounded-2xl flex justify-between lg:flex-row flex-col-reverse gap-10 ${loaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300 dark:bg-darker bg-lightest`}
      >
        <div className="lg:w-3/4">
          <a className="text-4xl font-semibold" href={`/post/${post.slug}`}>
            {post.title}
          </a>
          <p className="mb-5">
            {convertDateToString(post.created_at)} • {convertMinutesToString(post.stats.readingTime)}
          </p>

          <div
            className="lg:text-xl md:text-lg text-sm body-preview"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
        </div>
        {post.image &&
          <Image
          src={post.image}
          alt={`${post.title}'s image cover`}
          width={500}
          height={500}
          className="rounded-xl lg:w-[40%] w-full h-full"
          onLoad={() => setLoaded(!loaded)}
          loading="eager"
          />
        }
      </div>
    </>
  );
}