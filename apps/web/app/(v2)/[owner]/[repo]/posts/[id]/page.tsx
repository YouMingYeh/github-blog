import { getIssue, updateIssue } from "@/lib/github-issues-api";
import PostContent from "@/components/PostContent";

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
