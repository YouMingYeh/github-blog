"use client";
import React, { useEffect, useState } from "react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import Link from "next/link";

export default async function Page() {
  const params = useParams();
  const { owner } = params;

  const repos = await fetch(`https://api.github.com/users/${owner}/repos`);
  const data = await repos.json();

  return (
    <div className="relative z-0 p-3">
      {data?.map((r) => (
        <RepoCard repo={r} key={r.id} />
      ))}
    </div>
  );
}

function RepoCard({ repo }) {
  return (
    <div className="flex items-center gap-1 rounded-md  p-3">
      <div className="flex flex-col items-start">
        <Link href={`/${repo.owner.login}/${repo.name}`} className="underline">
          {repo.name}
        </Link>
      </div>
    </div>
  );
}
