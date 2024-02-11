import { getIssue, updateIssue } from "@/lib/github-issues-api";
import Blog from "./Blog";
import { Suspense } from "react";
import LoadingCircle from "@/components/ui/icons/loading-circle";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const issue = await getIssue(Number(id));

  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen place-content-center items-center justify-center align-middle">
          <LoadingCircle />
        </div>
      }
    >
      <Blog defaultContent={issue.body} defaultTitle={issue.title}></Blog>
    </Suspense>
  );
}
