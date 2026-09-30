// Fetches public GitHub data on the server (cached for an hour by Next.js).
// Optional: set GITHUB_TOKEN in .env.local / Vercel to avoid the API rate limit.

export type ContributionDay = { date: string; count: number; level: number };

export type GithubStats = {
  days: ContributionDay[];
  totalContributions: number;
  publicRepos: number | null;
  topLanguage: string | null;
};

async function getJson<T>(url: string): Promise<T | null> {
  try {
    const headers: Record<string, string> = { Accept: "application/json" };
    if (process.env.GITHUB_TOKEN && url.startsWith("https://api.github.com")) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    const res = await fetch(url, { headers, next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getGithubStats(username: string): Promise<GithubStats | null> {
  const [calendar, user, repos] = await Promise.all([
    // Public contributions calendar (last 365 days), no token needed.
    getJson<{ contributions: ContributionDay[] }>(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
    ),
    getJson<{ public_repos: number }>(`https://api.github.com/users/${username}`),
    getJson<{ language: string | null; fork: boolean }[]>(
      `https://api.github.com/users/${username}/repos?per_page=100&type=owner`,
    ),
  ]);

  const days = calendar?.contributions ?? [];
  if (days.length === 0 && !user && !repos) return null;

  const counts = new Map<string, number>();
  for (const repo of repos ?? []) {
    if (repo.fork || !repo.language) continue;
    counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
  }
  const topLanguage = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  return {
    days,
    totalContributions: days.reduce((sum, d) => sum + d.count, 0),
    publicRepos: user?.public_repos ?? null,
    topLanguage,
  };
}
