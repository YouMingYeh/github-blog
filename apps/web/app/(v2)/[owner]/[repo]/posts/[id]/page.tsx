import { getIssue } from "@/lib/github-issues-api";
import PostContent from "@/components/PostContentView";
import type { Metadata } from "next";

type Props = {
  params: { id: string; owner: string; repo: string };
};

// Generate the metadata for the page. It is used to improve the SEO of the site.
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

// This is the page for the individual post. We fetch the data from the server-side and render the post content in client-side, which is a good practice for SEO.
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
