"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import LoadingCircle from "@/components/ui/icons/loading-circle";
import { getIssues } from "@/lib/github-issues-api";
import { useScrollPosition } from "@/lib/hooks/use-scroll-position";
import { useAuth } from "@/lib/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

const SCROLL_THRESHOLD = 80;
const PER_PAGE = 10;
const DIRECTION = "asc";
const FETCH_DELAY = 5000;

export default function Page() {
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const { token } = useAuth();

  const router = useRouter();

  const searchParams = useSearchParams();

  const pathname = usePathname();

  const params = useParams();
  const { owner, repo }: { owner?: string; repo?: string } = params;

  const scrollPosition = useScrollPosition();

  const fetchData = useCallback(async () => {
    const params = {
      page: searchParams.get("page"),
      per_page: String(PER_PAGE),
      direction: DIRECTION,
    };

    const issues = await getIssues({
      token,
      owner,
      repo,
      params,
    });

    setLoading(false);
    if (issues.length === 0 || !issues.length) {
      return;
    }

    const isUnique = (issue: GitHubIssue, prev: GitHubIssue[]) =>
      !prev.some((prevIssue) => prevIssue.number === issue.number);

    setIssues((prev) => {
      const unique = issues?.filter((issue) => isUnique(issue, prev));
      return [...prev, ...unique];
    });
    setCurrentPage(Number(searchParams.get("page")) || 1);
  }, [searchParams, token, owner, repo]);

  useEffect(() => {
    if (loading) return;
    if (scrollPosition > SCROLL_THRESHOLD) {
      const nextPage = currentPage + 1;

      router.push(`${pathname}?page=${nextPage}`, { scroll: false });
      setLoading(true);
    }
  }, [scrollPosition]);

  useEffect(() => {
    if (!loading) return;
    setTimeout(() => {
      setLoading(false);
    }, FETCH_DELAY);
  }, [loading]);

  useEffect(() => {
    if (!loading) return;
    fetchData();
  }, [searchParams]);

  useEffect(() => {
    if (searchParams.get("page")) {
      router.push(`${pathname}`, { scroll: false });
    }
  }, []);

  const mappedIssues = useMemo(() => {
    return issues.map((issue) => {
      const title = issue.title;
      const description = issue.body;
      const link = `/posts/${issue.number}`;
      return {
        title: title,
        description: description,
        link: link,
      };
    });
  }, [issues]);

  return (
    <div className="z-0 p-3">
      <h1 className="text-center text-3xl font-bold">Posts</h1>
      <div className="h-96 w-screen p-3">
        {issues.length == 0 ? (
          <div className="grid grid-cols-1  gap-3 py-10 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="group relative block h-48 w-full  rounded-xl " />
            <Skeleton className="group relative block h-48 w-full  rounded-xl " />
            <Skeleton className="group relative block h-48 w-full  rounded-xl " />
          </div>
        ) : (
          <HoverEffect items={mappedIssues} />
        )}
      </div>
      {loading && (
        <div className="flex w-full justify-center">
          <LoadingCircle />
        </div>
      )}
    </div>
  );
}
