"use client";

import { Github } from "@/components/ui/icons";

import { Editor, type JSONContent } from "novel";
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
import { Button } from "@/components/ui/button";
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
import IssueComments from "@/components/IssueComments";
import { markdownToHtml } from "@/lib/converter";
import CustomEditor from "@/components/CustomEditor";
import TitleEditor from "@/components/TitleEditor";
import { useAuth } from "@/lib/contexts/AuthContext";

export default function Page() {
  const { id, owner, repo } = useParams();
  const { token } = useAuth();
  const router = useRouter();

  // Editor State
  const [content, setContent] = useState<JSONContent | null>(null);
  const [title, setTitle] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [saveStatus, setSaveStatus] = useState("Saved");

  // UI State
  const [loading, setLoading] = useState(true);
  const [autoSaveInterval, setAutoSaveInterval] = useState(60);

  // Fetch and update issue content
  const updateRemote = useCallback(async () => {
    if (title === "") {
      alert("Title cannot be empty");
      return;
    }
    if (htmlContent.length < 30) {
      alert("Content cannot be less than 30 characters");
      return;
    }
    try {
      await updateIssue(
        Number(id),
        { title, body: htmlContent },
        {
          token,
          owner: owner as string,
          repo: repo as string,
        },
      );
      setSaveStatus("Saved");
      router.refresh();
    } catch (e) {
      throw e;
    }
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
      const issue = await getIssue(Number(id), {
        token,
        owner: owner as string,
        repo: repo as string,
      });
      const htmlContent = markdownToHtml(issue.body);
      setHtmlContent(htmlContent);
      setContent(generateJSON(htmlContent, extensions));
      setTitle(issue.title);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    (async () => {
      if (saveStatus === "Saving...") {
        await updateRemote();
      }
    })();
  }, [saveStatus]);

  async function handleDeletePage() {
    if (confirm("Are you sure you want to delete this page?")) {
      const issue = await closeIssue(Number(id), {
        token,
        owner: owner as string,
        repo: repo as string,
      });
      router.refresh();
      router.replace("/");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center sm:px-5 sm:pt-[calc(10vh)]">
      <div className="fixed bottom-5 right-5 z-10">
        <Link href={`/${owner}/${repo}/posts/${id}`}>
          <Button size="icon" variant="ghost">
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
          <TitleEditor
            title={title}
            setTitle={setTitle}
            setSaveStatus={setSaveStatus}
          />
          <CustomEditor
            content={content}
            debouncedUpdates={debouncedUpdates}
            setSaveStatus={setSaveStatus}
          />
        </div>
      )}
      <IssueComments />
    </div>
  );
}
