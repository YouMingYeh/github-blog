// Utility to construct headers
const getHeaders = (token?: string) =>
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

// Generalized fetchGitHubAPI function to include owner and repo dynamically
async function fetchGitHubAPI<T>(
  endpoint: string,
  { method, body, token, params, owner, repo }: FetchOptions,
): GitHubResponse<T> {
  // Fallback to environment variables if owner or repo are not explicitly provided
  const effectiveOwner = owner ?? process.env.NEXT_PUBLIC_GITHUB_OWNER;
  const effectiveRepo = repo ?? process.env.NEXT_PUBLIC_GITHUB_REPO;

  if (!effectiveOwner || !effectiveRepo) {
    throw new Error("GitHub owner and repo must be specified");
  }

  const baseUrl = `https://api.github.com/repos/${effectiveOwner}/${effectiveRepo}`;
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

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
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

export const createIssue = async (
  issue: GitHubIssue,
  { token, owner, repo, params }: GitHubOptions = {},
): GitHubResponse<GitHubIssue> => {
  try {
    return fetchGitHubAPI<GitHubIssue>("issues", {
      method: "POST",
      body: issue,
      token,
      owner,
      repo,
      params,
    });
  } catch (error) {
    console.error("Error creating issue:", error);
    throw error;
  }
};

export const getIssues = async ({
  token,
  owner,
  repo,
  params,
}: GitHubOptions = {}): GitHubResponse<GitHubIssue[]> => {
  try {
    return fetchGitHubAPI<GitHubIssue[]>("issues", {
      method: "GET",
      token: token,
      owner: owner,
      repo: repo,
      params,
    });
  } catch (error) {
    console.error("Error getting issues:", error);
    throw error;
  }
};

export const getIssue = async (
  issue_number: number,
  { token, owner, repo, params }: GitHubOptions = {},
): GitHubResponse<GitHubIssue> => {
  try {
    return fetchGitHubAPI<GitHubIssue>(`issues/${issue_number}`, {
      method: "GET",
      token,
      owner,
      repo,
      params,
    });
  } catch (error) {
    console.error("Error getting issue:", error);
    throw error;
  }
};

export const updateIssue = async (
  issue_number: number,
  issue: GitHubIssue,
  { token, owner, repo, params }: GitHubOptions = {},
): GitHubResponse<GitHubIssue> => {
  try {
    return fetchGitHubAPI<GitHubIssue>(`issues/${issue_number}`, {
      method: "PATCH",
      body: issue,
      token,
      owner,
      repo,
      params,
    });
  } catch (error) {
    console.error("Error updating issue:", error);
    throw error;
  }
};

export const closeIssue = async (
  issue_number: number,
  { token, owner, repo, params }: GitHubOptions = {},
): GitHubResponse<GitHubIssue> => {
  try {
    return fetchGitHubAPI<GitHubIssue>(`issues/${issue_number}`, {
      method: "PATCH",
      body: { state: "closed" },
      token,
      owner,
      repo,
      params,
    });
  } catch (error) {
    console.error("Error closing issue:", error);
    throw error;
  }
};

export const getIssueComments = async (
  issue_number: number,
  { token, owner, repo, params }: GitHubOptions = {},
): GitHubResponse<IssueComment[]> => {
  try {
    return fetchGitHubAPI<IssueComment[]>(`issues/${issue_number}/comments`, {
      method: "GET",
      token,
      owner,
      repo,
      params,
    });
  } catch (error) {
    console.error("Error getting issue comments:", error);
    throw error;
  }
};
