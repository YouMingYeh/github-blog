import { getIssue, updateIssue } from "@/lib/github-issues-api-v2";
import Blog from "./Blog";

export default async function Page({
  params,
}: {
  params: { id: string; owner: string; repo: string };
}) {
  const { id, owner, repo } = params;

  const issue = await getIssue(Number(id), undefined, owner, repo);

  return (
    // <Suspense
    //   fallback={
    //     <div className="flex h-screen w-screen place-content-center items-center justify-center align-middle">
    //       <LoadingCircle />
    //     </div>
    //   }
    // >
    //   <Blog defaultContent={issue.body} defaultTitle={issue.title}></Blog>
    // </Suspense>
    <Blog defaultContent={issue.body} defaultTitle={issue.title}></Blog>
  );
}
