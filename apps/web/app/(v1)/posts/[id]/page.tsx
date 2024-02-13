import { getIssue } from "@/lib/github-issues-api";
import PostContent from "@/components/PostContent";
import type { Metadata } from "next";

type Props = {
  params: { id: string; owner: string; repo: string };
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

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const issue = await getIssue(Number(id));

  return <PostContent defaultContent={issue.body} defaultTitle={issue.title} />;
}
