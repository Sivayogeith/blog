"use client";
import { toast } from "sonner";

export default function Footer() {
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
      <a className="text-secondary" href="/about">
        About
      </a>
    </footer>
  );
}
