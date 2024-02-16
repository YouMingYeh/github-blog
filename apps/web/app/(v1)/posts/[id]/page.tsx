import { getIssue } from "@/lib/github-issues-api";
import PostContent from "@/components/PostContentView";
import type { Metadata } from "next";

type Props = {
  readonly params: {
    readonly id: string;
    readonly owner: string;
    readonly repo: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const { id } = params;

  // fetch data
  const issue = await getIssue(Number(id));

  return {
    title: issue.title,
    description: issue.body,
  };
}

interface PageProps {
  readonly params: { readonly id: string };
}

export default async function Page({ params }: PageProps) {
  const { id } = params;

  const issue = await getIssue(Number(id));

  return <PostContent defaultContent={issue.body} defaultTitle={issue.title} />;
}
