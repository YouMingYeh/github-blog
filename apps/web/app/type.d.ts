type GitHubIssue = {
  number?: string;
  title: string;
  body: string;
  state?: "open" | "closed";
};

type FetchOptions = {
  method: string;
  body?: Record<string, string | number | boolean>;
  token: string;
  params?: Record<string, string | number | boolean>;
};

type GitHubResponse<T> = Promise<T>;

type UndefinedOrNull = undefined | null | "undefined" | "null";
