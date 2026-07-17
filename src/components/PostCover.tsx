"use client";
import { Post } from "../api/postsAPI";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Spinner from "./Spinner";

export default function PostCover(props: {
  post: Post;
  className?: string;
  parentsParent?: boolean;
  spinner?: boolean;
  coverProps?: { className: string };
  spinnerProps?: { size: number }
}) {
  const { cover } = props.post;
  if (!cover) {
    return;
  }
  const imageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [loaded, setLoaded] = useState(false);

  const onLoad = () => {
    setLoaded(true);
    const ref = cover.type == "image" ? imageRef : videoRef;

    (props.parentsParent
      ? ref.current?.parentElement?.parentElement
      : ref.current?.parentElement
    )?.setAttribute("data-loaded", "true");
  };

  useEffect(() => {
    videoRef.current && videoRef.current.readyState >= 2 && onLoad();
  }, []);

  return (
    <div className={`${props.className} relative`}>
      {props.spinner && !loaded && (
        <div className="absolute inset-0 z-10 flex justify-center items-center border-2 border-dashed dark:border-lighter border-dark rounded-[inherit]">
          <Spinner size={props.spinnerProps?.size || 120} />
        </div>
      )}
      {cover.type == "image" ? (
        <Image
          src={cover.src}
          alt={`${props.post.title}'s image cover`}
          width={500}
          height={500}
          className={`${props.spinner && !loaded && "invisible"} ${props.coverProps?.className} rounded-[inherit]`}
          onLoad={onLoad}
          loading="eager"
          ref={imageRef}
        />
      ) : (
        <video
          src={cover.src}
          className={`${props.spinner && !loaded && "invisible"} ${props.coverProps?.className} rounded-[inherit]`}
          controls
          preload="metadata"
          onLoadedData={onLoad}
          ref={videoRef}
        >
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}
