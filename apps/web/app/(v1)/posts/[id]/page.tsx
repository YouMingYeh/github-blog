import { getIssue } from "@/lib/github-issues-api";
import PostContent from "@/components/PostContent";
export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const issue = await getIssue(Number(id));

  return <PostContent defaultContent={issue.body} defaultTitle={issue.title} />;
}
