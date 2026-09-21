// Use a new name so an older, unpartitioned cookie cannot shadow this session.
export const ADMIN_COOKIE_NAME = "sportathon_admin_session";
export const SESSION_AGE_SECONDS = 60 * 60 * 8;

export function getAdminCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    // The deployed admin is embedded cross-site on inkdabba.com.
    // Partitioning keeps its session available when third-party cookies are blocked.
    sameSite: isProduction ? ("none" as const) : ("lax" as const),
    secure: isProduction,
    partitioned: isProduction,
    maxAge: SESSION_AGE_SECONDS,
    path: "/"
  };
}
