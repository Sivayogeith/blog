"use client";
import { Post } from "../api/postsAPI";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Spinner from "./Spinner";

export default function PostCover(props: {
  post: Post;
  className?: string;
  coverProps?: { className: string };
  spinnerProps?: { size: number };
}) {
  const { cover } = props.post;

  if (!cover) return null;

  const [loaded, setLoaded] = useState(false);
  const coverClassName = `${props.coverProps?.className} ${loaded ? "opacity-100" : "opacity-0 pointer-events-none"} transition-opacity duration-500 rounded-[inherit]`;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (cover.type === "video" && videoRef.current!.readyState >= 2) {
      setLoaded(true);
    }
  }, [cover.type]);

  return (
    <div
      className={`${props.className} relative border ${!loaded && "border-2 border-dashed"} border-secondary `}
    >
      <div
        className={`absolute inset-0 z-10 flex justify-center items-center rounded-[inherit] transition-opacity duration-500 ${loaded ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        <Spinner size={props.spinnerProps?.size ?? 120} />
      </div>
      {cover.type == "image" ? (
        <Image
          loader={({ src }) => src}
          src={cover.src}
          alt={`${props.post.title}'s image cover`}
          width={500}
          height={500}
          className={coverClassName}
          onLoad={() => setLoaded(true)}
          loading="eager"
        />
      ) : (
        <video
          src={cover.src}
          className={coverClassName}
          controls
          preload="metadata"
          onLoadedData={() => setLoaded(true)}
          ref={videoRef}
        >
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}

export interface Cover {
  src: string;
  type: "image" | "video";
  caption?: string;
}
