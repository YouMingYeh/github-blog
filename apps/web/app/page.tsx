import { HoverEffect } from "@/components/ui/card-hover-effect";
import { getIssues } from "@/lib/github-issues-api";

export default async function Page() {
  const response = await getIssues();

  const issues = await response.json();

  const items = issues.map((issue) => {
    ("use server");
    return {
      title: issue.title,
      description: issue.body.slice(0, 100) + "...",
      link: `/${issue.number}`,
    };
  });

  return (
    <div className="h-1/2 p-3">
      <HoverEffect items={items} />
    </div>
  );
}
