import { markdownToHtml } from "@/lib/showdown";

export default function Page() {
  return <div>{markdownToHtml("<div>test</div>")}</div>;
}
