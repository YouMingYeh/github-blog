"use client";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import LoadingCircle from "@/components/ui/icons/loading-circle";
import { getIssues } from "@/lib/github-issues-api";
import { useScrollPosition } from "@/lib/hooks/use-scroll-position";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(0);

  const searchParams = useSearchParams();

  const scrollPosition = useScrollPosition();

  useEffect(() => {
    if (searchParams.get("page")) {
      router.replace("/");
    }
  }, []);

  useEffect(() => {
    if (scrollPosition > 80) {
      const nextPage = currentPage + 1;

      router.push(`?page=${nextPage}`, { scroll: false });
      setLoading(true);
    }
  }, [scrollPosition]);

  const fetchData = async () => {
    const params = {
      page: searchParams.get("page"),
      per_page: "10",
      direction: "asc",
    };
    const response = await getIssues(params);

    const issues = await response.json();

    if (issues.length === 0) {
      return;
    }

    setIssues((prev) => {
      const unique = issues.filter(
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
    }, 5000);
  }, [loading]);

  useEffect(() => {
    if (!loading) return;
    fetchData();
  }, [searchParams]);

  return (
    <div className="relative z-0 p-3">
      <HoverEffect
        items={issues.map((issue) => {
          ("use server");
          return {
            title: issue.title,
            description:
              issue.body.length > 100
                ? `${issue.body.slice(0, 100)}...`
                : issue.body,
            link: `/posts/${issue.number}`,
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
