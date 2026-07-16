"use client";
import { Post } from "../api/postsAPI";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function PostCover(props: {
  post: Post;
  className?: string;
  parentsParent?: boolean;
}) {
  const { cover } = props.post;
  if (!cover) {
    return;
  }
  const imageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const onLoad = () => {
    const ref = cover.type == "image" ? imageRef : videoRef;

    (props.parentsParent
      ? ref.current?.parentElement?.parentElement
      : ref.current?.parentElement
    )?.setAttribute("data-loaded", "true");
  };

  useEffect(() => {
    videoRef.current && videoRef.current.readyState >= 2 && onLoad();
  }, []);

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
    <video
      src={cover.src}
      className={props.className}
      controls
      preload="metadata"
      onLoadedData={onLoad}
      ref={videoRef}
    >
      Your browser does not support the video tag.
    </video>
  );
}
