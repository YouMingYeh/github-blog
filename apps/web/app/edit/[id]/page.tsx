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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useDebouncedCallback } from "use-debounce";
import { SaveAllIcon, TrashIcon, ViewIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { generateJSON } from "@tiptap/react";
import { closeIssue, getIssue, updateIssue } from "@/lib/github-issues-api";

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
import type { Session } from "next-auth";

// Type for my custom session with token
declare type SessionWithToken = Session & { token: string };

export default function Page() {
  const { id } = useParams();
  const { data } = useSession();
  const session = data as SessionWithToken;
  const router = useRouter();

  // Editor State
  const [content, setContent] = useState<JSONContent | null>(null);
  const [title, setTitle] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [saveStatus, setSaveStatus] = useState("Saved");

  // UI State
  const [loading, setLoading] = useState(true);
  const [autoSaveInterval, setAutoSaveInterval] = useState(60);

  // Feature Toggle State
  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);

  // Fetch and update issue content
  const updateRemote = useCallback(async () => {
    const token = localStorage.getItem("token");
    await updateIssue(Number(id), { title, body: htmlContent }, token);
    setSaveStatus("Saved");
    router.refresh();
  }, [id, title, htmlContent, router]);

  // Debounce updates
  const debouncedUpdates = useDebouncedCallback(async (editor: Editor) => {
    const json = editor.getJSON();
    setContent(json);
    const html = editor.getHTML();
    setHtmlContent(html);
    await updateRemote();
  }, autoSaveInterval * 1000);

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const issue = await getIssue(Number(id), token);
      setHtmlContent(issue.body);
      setContent(generateJSON(issue.body, extensions));
      setTitle(issue.title);
      setLoading(false);
    };

    fetchData();
  }, [id]);

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
        <p className="text-xl">Or, you need to sign in to edit the page</p>

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

  async function handleDeletePage() {
    if (confirm("Are you sure you want to delete this page?")) {
      const token = localStorage.getItem("token");
      const issue = await closeIssue(Number(id), token);
      router.refresh();
      window.location.replace("/");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center sm:px-5 sm:pt-[calc(10vh)]">
      <div className="fixed bottom-5 right-5 z-10">
        <Link href={`/posts/${id}`}>
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
        onClick={handleDeletePage}
      >
        <TrashIcon />
      </Button>
      {loading ? (
        <div className="flex h-screen w-screen justify-center align-middle">
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
