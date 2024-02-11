import { getIssue, updateIssue } from "@/lib/github-issues-api";
import Blog from "./Blog";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const response = await getIssue(Number(id));
  const issue = await response.json();

  return <Blog defaultContent={issue.body} defaultTitle={issue.title}></Blog>;
}
