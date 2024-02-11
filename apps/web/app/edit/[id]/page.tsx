"use client";

import { Github } from "@/components/ui/icons";

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
import { useCallback, useEffect, useState } from "react";
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
import { NodeSelector } from "@/lib/selectors/node-selector";
import { LinkSelector } from "@/lib/selectors/link-selector";
import { ColorSelector } from "@/lib/selectors/color-selector";
import TextButtons from "@/lib/selectors/text-buttons";
import { suggestionItems } from "@/lib/suggestions";
import { ImageResizer } from "novel/extensions";
import { AISelector } from "@/lib/selectors/ai-selector";
import Magic from "@/components/ui/icons/magic";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useDebouncedCallback } from "use-debounce";
import { SaveAllIcon, TrashIcon, ViewIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { generateJSON } from "@tiptap/react";
import { deleteIssue, getIssue, updateIssue } from "@/lib/github-issues-api";

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

import { useSession } from "next-auth/react";
import Link from "next/link";
import LoadingCircle from "@/components/ui/icons/loading-circle";

export default function Page() {
  const params = useParams();
  const { id } = params;
  const [content, setContent] = useState<JSONContent | null>();
  const { data: session }: any = useSession();

  // const [content, setContent] = useLocalStorage<JSONContent | null>(
  //   "novel-content",
  //   defaultEditorContent,
  // );[]
  const [saveStatus, setSaveStatus] = useState("Saved");

  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);
  const [autoSaveInterval, setAutoSaveInterval] = useState(60);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [htmlContent, setHtmlContent] = useState("");

  const updateRemote = useCallback(async () => {
    const token = localStorage.getItem("token");
    const response = await updateIssue(Number(id), title, htmlContent, token);
    const issue = await response.json();
    setSaveStatus("Saved");
  }, [id, title, htmlContent]);

  const debouncedUpdates = useDebouncedCallback(
    async (editor: Editor, title) => {
      const json = editor.getJSON();
      setContent(json);

      const html = editor.getHTML();
      setHtmlContent(html);
      await updateRemote();
    },
    autoSaveInterval * 1000,
  );

  useEffect(() => {
    (async () => {
      const response = await getIssue(Number(id));
      const issue = await response.json();
      setHtmlContent(issue.body);
      const json = generateJSON(issue.body, extensions);
      setContent(json);
      setTitle(issue.title);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    localStorage.setItem("token", session?.token);
  }, [session]);

  useEffect(() => {
    (async () => {
      if (saveStatus === "Saving...") {
        await updateRemote();
      }
    })();
  }, [saveStatus]);

  if (!session) {
    return (
      <div className="flex h-screen flex-col items-center justify-center ">
        <p className="text-2xl">Fetching session...</p>
        <p className="text-2xl">Or, you need to sign in to edit the page</p>

        <Button
          onClick={() => {
            window.location.href = "/api/auth/signin";
          }}
          className="hover:bg-accent-hover flex items-center gap-2"
        >
          <Github /> Sign in with GitHub
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center sm:px-5 sm:pt-[calc(10vh)]">
      <div className="fixed bottom-5 right-5 z-10">
        <Link href={`/${id}`}>
          <Button size="icon" onClick={() => {}}>
            <ViewIcon />
          </Button>
        </Link>
      </div>
      <Button
        variant="outline"
        className="fixed bottom-5 left-5 z-10"
        size="icon"
        onClick={() => {
          debouncedUpdates.flush();
          setSaveStatus("Saving...");
        }}
      >
        {" "}
        <SaveAllIcon />
      </Button>
      <Button
        variant="outline"
        className="fixed bottom-20 left-5 z-10"
        size="icon"
        onClick={async () => {
          confirm("Are you sure you want to delete this page?") &&
            (await deleteIssue(Number(id), localStorage.getItem("token"))) &&
            window.location.replace("/");
        }}
      >
        <TrashIcon />
      </Button>
      {loading ? (
        <div className="h-full w-full justify-center align-middle">
          <LoadingCircle />
        </div>
      ) : (
        <div className=" w-full max-w-screen-lg">
          <div className="fixed left-5 top-32 z-10 mb-5 rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground sm:top-20">
            <label>Auto Save Interval: </label>
            <input
              value={autoSaveInterval}
              name="autoSaveInterval"
              onChange={(e) => {
                setAutoSaveInterval(Number(e.target.value));
              }}
              className="w-10 bg-background px-1 text-center text-muted-foreground"
            />
            <label>secs </label>
          </div>

          <div className="fixed right-5 top-32 z-10 mb-5 rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground sm:top-20">
            {saveStatus}
          </div>
          <input
            className="w-full bg-background py-8 text-center text-6xl focus:outline-none"
            defaultValue={title}
            placeholder="Title"
            onChange={(e) => {
              setSaveStatus("Unsaved");
              setTitle(e.target.value);
            }}
          ></input>
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
                  debouncedUpdates(editor, title);
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
                      <NodeSelector
                        open={openNode}
                        onOpenChange={setOpenNode}
                      />
                      <Separator orientation="vertical" />

                      <LinkSelector
                        open={openLink}
                        onOpenChange={setOpenLink}
                      />

                      <Separator orientation="vertical" />

                      <TextButtons />
                      <Separator orientation="vertical" />

                      <ColorSelector
                        open={openColor}
                        onOpenChange={setOpenColor}
                      />
                    </>
                  )}
                </EditorBubble>
              </EditorContent>
            ) : (
              <LoadingCircle />
            )}
          </EditorRoot>
        </div>
      )}
    </div>
  );
}
