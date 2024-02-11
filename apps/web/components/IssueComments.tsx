"use client";

import { getIssueComments } from "@/lib/github-issues-api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function IssueComments() {
  const [issueComments, setIssueComments] = useState([]);
  const token = localStorage.getItem("token");
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    const fetchData = async () => {
      const comments = await getIssueComments(Number(id), token);
      setIssueComments(comments);
    };
    fetchData();
  }, [id]);

  if (issueComments.length === 0) {
    return <div>No comments</div>;
  }

  return (
    <div className="flex w-full flex-col gap-2 px-20">
      <h2 className="text-xl font-bold">Comments</h2>
      {issueComments.map((comment) => (
        <CommentCard comment={comment} />
      ))}
    </div>
  );
}

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function CommentCard({ comment }: { comment: IssueComment }) {
  return (
    <div className="relative my-1 flex w-full items-center space-x-2 rounded-md border p-3 ">
      <Avatar className=" aspect-square">
        <AvatarImage
          src={comment.user.avatar_url as string}
          alt={(comment.user.login as string).substring(0, 2)}
        />
        <AvatarFallback>
          {(comment.user.login as string).substring(0, 2)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">{comment.user.login}</p>
        <p className="text-sm text-muted-foreground">{comment.body}</p>
      </div>
    </div>
  );
}
