import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  revalidatePath("/", "layout");
  return Response.json({ revalidated: true, now: Date.now() });
}
