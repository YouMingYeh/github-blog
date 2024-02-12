"use client";

import {
  defaultEditorProps,
  EditorRoot,
  EditorCommand,
  EditorCommandItem,
  EditorCommandEmpty,
  EditorContent,
  type JSONContent,
} from "novel";
import { useState } from "react";
import {
  taskItem,
  taskList,
  tiptapImage,
  tiptapLink,
  updatedImage,
  horizontalRule,
  slashCommand,
  starterKit,
  placeholder,
} from "@/lib/extensions";

import { suggestionItems } from "@/lib/suggestions";
import { ImageResizer } from "novel/extensions";

import { useParams } from "next/navigation";
import { generateJSON } from "@tiptap/react";
import { EditIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import IssueComments from "@/components/IssueCommentsV2";
import { markdownToHtml } from "@/lib/converter";
import LoadingCircle from "@/components/ui/icons/loading-circle";

const extensions = [
  starterKit,
  horizontalRule,
  tiptapLink,
  tiptapImage,
  updatedImage,
  taskList,
  taskItem,
  slashCommand,
  placeholder,
];

export default function Blog({
  defaultContent,
  defaultTitle,
}: {
  defaultContent: string;
  defaultTitle: string;
}) {
  if (typeof window === "undefined") return null;
  const params = useParams();
  const { id, owner, repo } = params;
  const htmlContent = markdownToHtml(defaultContent);
  const [content, setContent] = useState<JSONContent | null>(
    generateJSON(htmlContent, extensions),
  );
  const [title, setTitle] = useState(defaultTitle);

  return (
    <div className="flex min-h-screen flex-col items-center sm:px-5 sm:pt-[calc(10vh)]">
      <div className="relative w-full max-w-screen-lg">
        <div className="fixed bottom-5 right-5 z-10">
          <Link href={`/${owner}/${repo}/edit/${id}`}>
            <EditIcon />
          </Link>
        </div>
        <div className="w-full py-8 text-center text-6xl ">{title}</div>
        <EditorRoot>
          {content && (
            <EditorContent
              extensions={extensions}
              content={content}
              className="relative min-h-[500px] w-full max-w-screen-lg border-muted bg-background shadow-none  "
              editorProps={{
                ...defaultEditorProps,
                attributes: {
                  class: `prose-lg prose-stone dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
                },
              }}
              editable={false}
              slotAfter={<ImageResizer />}
            >
              <EditorCommand className="z-50 h-auto max-h-[330px]  w-72 overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
                <EditorCommandEmpty className="px-2 text-muted-foreground">
                  No results
                </EditorCommandEmpty>
                {suggestionItems.map((item) => (
                  <EditorCommandItem
                    value={item.title}
                    onCommand={(val) => item.command(val)}
                    className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent `}
                    key={item.title}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </EditorCommandItem>
                ))}
              </EditorCommand>
            </EditorContent>
          )}
        </EditorRoot>
      </div>
      <IssueComments />
    </div>
  );
}
