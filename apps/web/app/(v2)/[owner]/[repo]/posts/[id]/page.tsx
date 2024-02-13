import { getIssue, updateIssue } from "@/lib/github-issues-api";
import PostContent from "@/components/PostContent";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { id: string; owner: string; repo: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const { id, owner, repo } = params;

  // fetch data
  const issue = await getIssue(Number(id), { owner, repo });

  return {
    title: issue.title,
    description: issue.body,
  };
}

export default async function Page({
  params,
}: {
  params: { id?: string; owner?: string; repo?: string };
}) {
  const { id, owner, repo } = params;

  const issue = await getIssue(Number(id), { owner, repo });

  return (
    <PostContent
      defaultContent={issue.body}
      defaultTitle={issue.title}
    ></PostContent>
  );
}
