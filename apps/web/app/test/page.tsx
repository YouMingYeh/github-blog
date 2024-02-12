import { markdownToHtml } from "@/lib/converter";

export default function Page() {
  return <div>{markdownToHtml("<div>test</div>")}</div>;
}
