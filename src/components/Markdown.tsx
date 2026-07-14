"use client";
import { useTheme } from "@teispace/next-themes";
import MarkdownPreview, {
  MarkdownPreviewProps,
} from "@uiw/react-markdown-preview";

export default function Markdown(
  props: MarkdownPreviewProps & { class?: string },
) {
  const { resolvedTheme } = useTheme<"light" | "dark">();
  return (
    <MarkdownPreview
      className={`bg-transparent! dark:text-white! text-black! ${props.class}`}
      wrapperElement={{
        "data-color-mode": resolvedTheme,
      }}
      {...props}
    />
  );
}
