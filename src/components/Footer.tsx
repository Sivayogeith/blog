"use client";
import { toast } from "sonner";
import { getCommits } from "../api/indexAPI";
import { useEffect, useState } from "react";

export default function Footer() {
  const [lastCommits, setLastCommits] = useState(
    {} as {
      blog: { count: number; last: any };
      blogAPI: { count: number; last: any };
    },
  );
  useEffect(() => {
    getCommits().then(setLastCommits as any);
  }, []);

  return (
    <footer className="flex justify-between mt-5 py-5 px-8 border-t border-secondary">
      <p
        onClick={() => {
          toast(
            "Uh, I have no clue why I added this or What exactly this means...",
          );
        }}
      >
        © Copyright themeowingsage {new Date().getFullYear()}
      </p>
      <div className="flex gap-1 items-center">
        {lastCommits?.blog && (
          <>
            <a className="text-secondary opacity-70 text-sm" href={lastCommits.blog.last.html_url} target="_blank">
              {lastCommits.blog.last.sha.slice(0, 7)}
            </a>
            •
            <a
              className="text-secondary opacity-70 text-sm"
              href={lastCommits.blogAPI.last.html_url}
              target="_blank"
            >
              {lastCommits.blogAPI.last.sha.slice(0, 7)}
            </a>
          </>
        )}
        <a className="text-secondary ms-3" href="/about">
          About
        </a>
      </div>
    </footer>
  );
}
