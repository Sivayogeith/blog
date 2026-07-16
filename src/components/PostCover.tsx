"use client"
import { Post } from "../api/postsAPI";
import Image from "next/image";
import { useRef, useState } from "react";

export default function PostCover(props: { post: Post; className?: string, parentsParent?: boolean}) {
  const { cover } = props.post;
  if (!cover) {
    return;
  }
  const imageRef = useRef<HTMLImageElement>(null);
  const onLoad = () => {
    (props.parentsParent ? imageRef.current?.parentElement?.parentElement : imageRef.current?.parentElement)?.setAttribute("data-loaded", "true")
  }
  return cover.type == "image" ? (
    <Image
      src={cover.src}
      alt={`${props.post.title}'s image cover`}
      width={500}
      height={500}
      className={props.className}
      onLoad={onLoad}
      loading="eager"
      ref={imageRef}
    />
  ) : (
    <video src={cover.src} className={props.className} controls preload="auto">
      Your browser does not support the video tag.
    </video>
  );
}
