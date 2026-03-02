/**
 * Markdown parser and renderer utility.
 *
 * CONTEXT: Shared/Generic Rendering
 * Renders guide content (discovery/playbooks) and portfolio documentation.
 * Used in /guides/[slug] pages (discovery) and potentially portfolio sections.
 * Context-agnostic; serves both purposes transparently.
 */

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { cn } from "@/lib/utils";

interface MarkdownContentProps {
  content: string;
  className?: string;
  compact?: boolean;
}

export function MarkdownContent({
  content,
  className,
  compact = false,
}: MarkdownContentProps) {
  return (
    <div
      className={cn(
        "markdown-content",
        compact && "markdown-content-compact",
        className,
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
