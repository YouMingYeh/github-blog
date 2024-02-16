import { getIssue } from "@/lib/github-issues-api";
import PostContent from "@/components/PostContentView";
import type { Metadata } from "next";

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

interface PageProps {
  readonly params: {
    readonly id: string;
    readonly owner: string;
    readonly repo: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { id, owner, repo } = params;

  const issue = await getIssue(Number(id), { owner, repo });

  return (
    <PostContent
      defaultContent={issue.body}
      defaultTitle={issue.title}
    ></PostContent>
  );
}
