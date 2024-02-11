"use client";
import React, { useEffect, useState } from "react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import LoadingCircle from "@/components/ui/icons/loading-circle";
import { getIssues } from "@/lib/github-issues-api-v2";
import { useScrollPosition } from "@/lib/hooks/use-scroll-position";

const SCROLL_THRESHOLD = 80;
const PER_PAGE = 10;
const DIRECTION = "asc";
const FETCH_DELAY = 5000;

export default function Page() {
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const router = useRouter();

  const searchParams = useSearchParams();

  const pathname = usePathname();

  const params = useParams();
  const { owner, repo } = params;

  const scrollPosition = useScrollPosition();

  useEffect(() => {
    if (scrollPosition > SCROLL_THRESHOLD) {
      const nextPage = currentPage + 1;

      router.push(`${pathname}?page=${nextPage}`, { scroll: false });
      setLoading(true);
    }
  }, [scrollPosition]);

  const fetchData = async () => {
    const params = {
      page: searchParams.get("page"),
      per_page: String(PER_PAGE),
      direction: DIRECTION,
    };

    const token = localStorage.getItem("token");
    const issues = await getIssues(
      token,
      owner as string,
      repo as string,
      params,
    );

    if (issues.length === 0 || !issues.length) {
      return;
    }

    setIssues((prev) => {
      const unique = issues?.filter(
        (issue) => !prev.some((prevIssue) => prevIssue.number === issue.number),
      );
      return [...prev, ...unique];
    });
    setCurrentPage(Number(searchParams.get("page")) || 1);
    setLoading(false);
  };

  useEffect(() => {
    if (!loading) return;
    setTimeout(() => {
      setLoading(false);
    }, FETCH_DELAY);
  }, [loading]);

  useEffect(() => {
    if (searchParams.get("page")) {
      router.push(`${pathname}`, { scroll: false });
    }
    if (!loading) return;
    fetchData();
  }, [searchParams]);

  return (
    <div className="relative z-0 p-3">
      <h1 className="text-center text-3xl font-bold">Posts</h1>
      <HoverEffect
        items={issues.map((issue) => {
          ("use server");
          return {
            title: issue.title,
            description:
              issue.body?.length > 100
                ? `${issue.body?.slice(0, 100)}...`
                : issue.body,
            link: `${pathname}/posts/${issue.number}`,
          };
        })}
      />
      {loading && (
        <div className="flex w-full justify-center">
          <LoadingCircle />
        </div>
      )}
    </div>
  );
}
