import {
  defaultEditorProps,
  Editor,
  EditorRoot,
  EditorBubble,
  EditorCommand,
  EditorCommandItem,
  EditorCommandEmpty,
  EditorContent,
  type JSONContent,
} from "novel";

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
import { ImageResizer } from "novel/extensions";
import { AISelector } from "@/lib/selectors/ai-selector";

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

import { suggestionItems } from "@/lib/suggestions";
import { NodeSelector } from "@/lib/selectors/node-selector";
import { Separator } from "./ui/separator";
import { LinkSelector } from "@/lib/selectors/link-selector";
import TextButtons from "@/lib/selectors/text-buttons";
import { ColorSelector } from "@/lib/selectors/color-selector";
import LoadingCircle from "./ui/icons/loading-circle";
import { useState } from "react";

interface CustomEditorProps {
  readonly content: JSONContent;
  readonly debouncedUpdates: (editor: Editor) => void;
  readonly setSaveStatus: (status: string) => void;
}

export default function CustomEditor({
  content,
  debouncedUpdates,
  setSaveStatus,
}: CustomEditorProps) {
  // Feature Toggle State
  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);
  return (
    <EditorRoot>
      {content ? (
        <EditorContent
          extensions={extensions}
          content={content}
          className="relative min-h-[500px] w-full max-w-screen-lg border-muted bg-background sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg"
          editorProps={{
            ...defaultEditorProps,
            attributes: {
              class: `prose-lg prose-stone dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
            },
          }}
          onUpdate={({ editor }) => {
            debouncedUpdates(editor);
            setSaveStatus("Unsaved");
          }}
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

          <EditorBubble
            tippyOptions={{
              placement: openAI ? "bottom-start" : "top",
              onHidden: () => {
                setOpenAI(false);
              },
            }}
            className="flex w-fit max-w-[90vw] overflow-hidden rounded border border-muted bg-background shadow-xl"
          >
            {openAI ? (
              <AISelector open={openAI} onOpenChange={setOpenAI} />
            ) : (
              <>
                <NodeSelector open={openNode} onOpenChange={setOpenNode} />
                <Separator orientation="vertical" />

                <LinkSelector open={openLink} onOpenChange={setOpenLink} />

                <Separator orientation="vertical" />

                <TextButtons />
                <Separator orientation="vertical" />

                <ColorSelector open={openColor} onOpenChange={setOpenColor} />
              </>
            )}
          </EditorBubble>
        </EditorContent>
      ) : (
        <LoadingCircle />
      )}
    </EditorRoot>
  );
}
