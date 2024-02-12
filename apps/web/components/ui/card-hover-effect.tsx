"use client";
import { useScrollPosition } from "@/lib/hooks/use-scroll-position";
import { markdownToHtml } from "@/lib/showdown";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    link: string;
  }[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="h-96">
      <div
        className={cn(
          "grid grid-cols-1  py-10  md:grid-cols-2 lg:grid-cols-3",
          className,
        )}
      >
        {items.map((item, idx) => (
          <Link
            href={item?.link}
            key={item?.link}
            className="group relative  block h-full w-full p-2"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.span
                  className="absolute inset-0 block h-full w-full rounded-3xl bg-neutral-200  dark:bg-slate-800/[0.8]"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { duration: 0.15 },
                  }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.15, delay: 0.2 },
                  }}
                />
              )}
            </AnimatePresence>
            <Card>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription htmlContent={item.description}></CardDescription>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "relative z-50 h-full w-full overflow-hidden rounded-2xl border border-transparent bg-background p-4 shadow-md transition-all group-hover:bg-background dark:border-slate-700",
        className,
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};
export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4
      className={cn(
        "mt-4 font-bold tracking-wide text-zinc-800 dark:text-slate-100",
        className,
      )}
    >
      {children}
    </h4>
  );
};
export const CardDescription = ({
  className,
  htmlContent, // Changed from `children` to specifically accept a string
}: {
  className?: string;
  htmlContent: string; // Expecting a string now
}) => {
  const content = markdownToHtml(htmlContent);
  return (
    <p
      className={cn(
        "mt-8 text-sm leading-relaxed tracking-wide text-zinc-600 dark:text-slate-300",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: content }} // Using dangerouslySetInnerHTML
    ></p>
  );
};
