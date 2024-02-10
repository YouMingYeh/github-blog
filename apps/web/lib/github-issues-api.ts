const owner = process.env.GITHUB_OWNER || "YouMingYeh";
const repo = process.env.GITHUB_REPO || "github-blog";

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

export const getIssues = async () => {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues`,
    {
      method: "GET",
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );
  return response;
};

export const getIssue = async (issue_number: number) => {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues/${issue_number}`,
    {
      method: "GET",
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );
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
