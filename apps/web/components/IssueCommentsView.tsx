"use client";

import { getIssueComments } from "@/lib/github-issues-api";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function IssueComments() {
  const [loading, setLoading] = useState(true);
  const [issueComments, setIssueComments] = useState<IssueComment[]>([]);
  const { token } = useAuth();
  const params = useParams();
  const [page, setPage] = useState(1);
  const { id, owner, repo }: { id?: string; owner?: string; repo?: string } =
    params;
  const [noMoreComments, setNoMoreComments] = useState(false);

  const fetchData = useCallback(async () => {
    const params = {
      page: page,
      per_page: 10,
    };
    const comments = await getIssueComments(Number(id), {
      token,
      owner,
      repo,
      params,
    });
    setLoading(false);

    if (comments.length === 0) {
      setNoMoreComments(true);
      return;
    }

    const isUnique = (comment: IssueComment, prev: IssueComment[]) =>
      !prev.some((prevComment) => prevComment.id === comment.id);

    setIssueComments((prev) => {
      const unique = comments?.filter((comment) => isUnique(comment, prev));
      return [...prev, ...unique];
    });
  }, [id, page, token, owner, repo]);

  useEffect(() => {
    if (!loading) return;

    fetchData();
  }, [id, page, loading]);

  if (issueComments.length === 0) {
    return <div>No comments</div>;
  }

  return (
    <div className="flex w-full flex-col items-center gap-2 px-20 py-10">
      <h2 className="text-xl font-bold">Comments</h2>
      {issueComments.map((comment, index) => (
        <CommentCard
          comment={comment}
          key={comment.user.login + String(index)}
        />
      ))}
      {noMoreComments ? (
        <div>No more comments</div>
      ) : (
        <Button
          aria-label="load-more"
          onClick={() => {
            setLoading(true);
            setPage(page + 1);
          }}
        >
          {loading ? <LoadingCircle /> : "Load more"}
        </Button>
      )}
      {loading && <LoadingCircle />}
    </div>
  );
}

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import LoadingCircle from "./ui/icons/loading-circle";
import { useAuth } from "@/lib/contexts/AuthContext";

interface IssueCommentProps {
  readonly comment: IssueComment;
}

function CommentCard({ comment }: IssueCommentProps) {
  return (
    <div className="relative my-1 flex w-full items-center space-x-2 rounded-md border p-3 ">
      <Avatar className=" aspect-square">
        <AvatarImage
          src={comment.user.avatar_url}
          alt={comment.user.login.substring(0, 2)}
        />
        <AvatarFallback>{comment.user.login.substring(0, 2)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">{comment.user.login}</p>
        <p className="text-sm text-muted-foreground">{comment.body}</p>
      </div>
    </div>
  );
}
