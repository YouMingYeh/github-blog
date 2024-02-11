import { getIssue, updateIssue } from "@/lib/github-issues-api";
import Blog from "./Blog";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const issue = await getIssue(Number(id));

  return <Blog defaultContent={issue.body} defaultTitle={issue.title}></Blog>;
}
