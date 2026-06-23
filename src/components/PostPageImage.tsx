"use client";
import Image from "next/image";
import { useState } from "react";

export default function PostPageImage ()  {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <Image
      src="/cats.png"
      alt="cats"
      width={500}
      height={500}
      className={`rounded-xl w-full h-auto mb-5 ${loaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300 bg-darker`}
      loading="eager"
      onLoad={() => setLoaded(!loaded)}
    />
  );
};
