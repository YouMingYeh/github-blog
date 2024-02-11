import { revalidatePath } from "next/cache";

const owner = process.env.NEXT_PUBLIC_GITHUB_OWNER;
const repo = process.env.NEXT_PUBLIC_GITHUB_REPO;

export const createIssue = async (
  title: string,
  body: string,
  token: string,
) => {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues`,
    {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({
        title: title,
        body: body,
      }),
    },
  );
  return response;
};

export const getIssues = async (params?: Record<string, string>) => {
  const url = new URL(`https://api.github.com/repos/${owner}/${repo}/issues`);

  if (params) {
    const searchParams = new URLSearchParams(params);
    url.search = searchParams.toString();
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  return response;
};

export const getIssue = async (issue_number: number) => {
  const url = new URL(
    `https://api.github.com/repos/${owner}/${repo}/issues/${issue_number}`,
  );
  url.searchParams.append("state", "open");

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  return response;
};

export const updateIssue = async (
  issue_number: number,
  title: string,
  body: string,
  token: string,
) => {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues/${issue_number}`,
    {
      method: "PATCH",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({
        title: title,
        body: body,
      }),
    },
  );
  return response;
};

// This set the issue to close
export const deleteIssue = async (issue_number: number, token: string) => {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues/${issue_number}`,
    {
      method: "PATCH",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({
        state: "closed",
      }),
    },
  );
  return response;
};
