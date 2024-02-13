"use client";
import React, { useEffect, useState } from "react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import Link from "next/link";
import { HoverEffect } from "@/components/ui/card-hover-effect";

export default async function Page() {
  const params = useParams();
  const { owner } = params;

  try {
    const repos = await fetch(`https://api.github.com/users/${owner}/repos`);
    const data = await repos.json();

    const items = data?.map((r) => ({
      title: r.name,
      description: r.description,
      link: `/${r.owner.login}/${r.name}`,
    }));

    return (
      <div className="relative z-0 p-3">
        <h1 className="text-center text-3xl font-bold">Posts</h1>
        <HoverEffect items={items} />
      </div>
    );
  } catch (e) {
    return <div>error</div>;
  }
}
