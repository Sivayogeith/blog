import { cookies } from "next/headers";
import qs from "querystring";

// fetch methods
export const get = async (path: string) => {
  const response = await fetch(process.env.API + path, {
    headers: {
      Cookie: await getCookies(),
    },
  });

  return response;
};

export const post = async (
  path: string,
  body: [] | {} | FormData,
  setSession: boolean = false,
) => {
  const headers: HeadersInit = { Cookie: await getCookies() };
  if (!(body instanceof FormData)) headers["Content-Type"] = "application/json";

  const response = await fetch(process.env.API + path, {
    method: "POST",
    headers,
    body: body instanceof FormData ? body : JSON.stringify(body),
  });

  if (setSession) {
    const sessionCookie = await parseSessionCookies(response);

    if (sessionCookie) {
      (await cookies()).set("connect.sid", sessionCookie);
    }
  }

  return response;
};

export const del = async (path: string, body: [] | {} = {}) =>
  await fetch(process.env.API + path, {
    method: "DELETE",
    headers: { Cookie: await getCookies(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

// helper functions
export const getCookies = async (): Promise<string> =>
  (await cookies()).toString() || "";

export const parseSessionCookies = async (res: Response): Promise<string> =>
  (qs.parse(res.headers.getSetCookie()[0], "; ") as any)["connect.sid"];

// Types
export interface User {
  username: string;
  name: string;
  isAdmin: boolean;
  isOwner: boolean;
  image: string;
  slackId: string;
}

export interface SessionData {
  username: string;
  name: string;
  userId: string;
  isAdmin: boolean;
  isOwner: boolean;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  created_at: Date;
  slug: string;
  stats: {
    readingTime: number;
    words: number;
  };
  cover?: {
    type: "image" | "video";
    src: string;
    caption: string;
  };
  author: string;
}

export interface Comment {
  id: number;
  created_at: string;
  from: string; // username from users
  image: string; // user's profile picture
  on: number; // slug from posts
  message: string;
  likes: string[];
  dislikes: string[];
}

export interface MacondoProject {
  id: number;
  user_id: string;
  name: string;
  type: string;
  description: string;
  fruit: string;
  level: string;
  stage: number;
  demo_url: string | null;
  thumbnail_url: string | null;
  repository_url: string | null;
  hackatime_projects: unknown[];
  is_fork: boolean;
  guide: string | null;
  html_content: string | null;
  css_content: string | null;
  readme_content: string | null;
  last_html_sha: string | null;
  last_css_sha: string | null;
  invite_code: string;
  project_streak_days: number;
  last_worked_date: string;
  auto_use_streak_freezes: boolean;
  cart_screenshots: unknown | null;
  build_cost_cents: number | null;
  next_ship_needs_funding: boolean;
  next_ship_is_build_complete: boolean;
  next_ship_used_ai: boolean;
  next_ship_ai_usage_description: string | null;
  next_ship_is_update: boolean;
  next_ship_update_description: string | null;
  next_ship_reviewer_note: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;

  owner: {
    id: string;
    image: string;
    username: string;
    slack_id: string;
  };

  journals: {
    id: number;
    short_brief: string;
    long_brief: string;
    hours: number;
    created_at: string;
    archived: boolean;
    archived_at: string | null;
    content_language: string;
    author_id: string;
    author_username: string;
    author_slack_id: string;
    author_image: string;
  }[];

  viewer_is_owner: boolean;
  viewer_can_edit: boolean;
  activeShip: unknown | null;
  needsChangesShip: unknown | null;
  latestActiveGrant: unknown | null;
  has_active_grant: boolean;
  hasPreviousShippedShip: boolean;
  permRejected: boolean;
  is_extra_fruity: boolean;
  pendingFruit: unknown | null;
  previousShippedHackatimeHours: number | null;
  unshippedJournalHours: number | null;
  streakStatus: string;
}
