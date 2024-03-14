import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET() {
  // Use the Next.js utils to invalidate the "router cache" for the whole site
  revalidatePath("/", "layout");
  return Response.json({ revalidated: true, now: Date.now() });
}

// Note: This is a route handler that is used to invalidate the cache for the whole site. However, there are some GitHub issues/Twitter threads that said that this might not work as expected. Also, Next.js documentation does say it is not possible to revalidate router cache. See: https://nextjs.org/docs/app/building-your-application/caching