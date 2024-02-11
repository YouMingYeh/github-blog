export const dynamic = "force-dynamic";

// Utility to construct headers
const getHeaders = (token: string | undefined) =>
  token && token !== "undefined" && token !== "null"
    ? {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      }
    : {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      };

async function fetchGitHubAPI<T>(
  endpoint: string,
  owner: string,
  repo: string,
  { method, body, token, params }: FetchOptions,
): GitHubResponse<T> {
  const baseUrl = `https://api.github.com/repos/${owner}/${repo}`;
  let url = `${baseUrl}/${endpoint}`;

  // Append query parameters to the URL, if any
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    url += `?${searchParams.toString()}`;
  }

  const headers = getHeaders(token);

  console.log(headers);

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });

    if (!response.ok) {
      // Handle non-2xx responses
      throw new Error(
        `GitHub API error: ${response.status} ${await response.text()}`,
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error("GitHub API request failed:", error);
    throw error;
  }
}

// const owner = process.env.NEXT_PUBLIC_GITHUB_OWNER;
// const repo = process.env.NEXT_PUBLIC_GITHUB_REPO;

export const createIssue = async (
  issue: GitHubIssue,
  token: string | undefined,
  owner: string,
  repo: string,
  params?: Record<string, string | number | boolean>,
): GitHubResponse<GitHubIssue> => {
  return fetchGitHubAPI<GitHubIssue>("issues", owner, repo, {
    method: "POST",
    body: issue,
    token,
    params,
  });
};

export const getIssues = async (
  token: string | undefined,
  owner: string,
  repo: string,
  params?: Record<string, string | number | boolean>,
): GitHubResponse<GitHubIssue[]> => {
  return fetchGitHubAPI<GitHubIssue[]>("issues", owner, repo, {
    method: "GET",
    token: token,
    params,
  });
};

export const getIssue = async (
  issue_number: number,
  token: string | undefined,
  owner: string,
  repo: string,
  params?: Record<string, string | number | boolean>,
): GitHubResponse<GitHubIssue> => {
  return fetchGitHubAPI<GitHubIssue>(
    `issues/${issue_number}`,

    owner,
    repo,
    {
      method: "GET",
      token,
      params,
    },
  );
};

export const updateIssue = async (
  issue_number: number,
  issue: GitHubIssue,
  token: string | undefined,
  owner: string,
  repo: string,
  params?: Record<string, string | number | boolean>,
): GitHubResponse<GitHubIssue> => {
  console.log("updateIssue", issue_number, issue, token);
  return fetchGitHubAPI<GitHubIssue>(
    `issues/${issue_number}`,

    owner,
    repo,
    {
      method: "PATCH",
      body: issue,
      token,
      params,
    },
  );
};

export const closeIssue = async (
  issue_number: number,
  token: string | undefined,
  owner: string,
  repo: string,
  params?: Record<string, string | number | boolean>,
): GitHubResponse<GitHubIssue> => {
  return fetchGitHubAPI<GitHubIssue>(
    `issues/${issue_number}`,

    owner,
    repo,
    {
      method: "PATCH",
      body: { state: "closed" },
      token,
      params,
    },
  );
};

export const getIssueComments = async (
  issue_number: number,
  token: string | undefined,
  owner: string,
  repo: string,
  params?: Record<string, string | number | boolean>,
): GitHubResponse<IssueComment[]> => {
  return fetchGitHubAPI<IssueComment[]>(
    `issues/${issue_number}/comments`,
    owner,
    repo,
    {
      method: "GET",
      token,
      params,
    },
  );
};
