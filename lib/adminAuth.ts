import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const ADMIN_COOKIE = "jazzlight_admin";

export function isValidAdminToken(token: string | undefined | null) {
  return Boolean(process.env.ADMIN_TOKEN && token === process.env.ADMIN_TOKEN);
}

export function isAdminCookieValid() {
  return isValidAdminToken(cookies().get(ADMIN_COOKIE)?.value);
}

export function isAdminRequest(request: NextRequest) {
  const headerToken = request.headers.get("x-admin-token");
  const cookieToken = request.cookies.get(ADMIN_COOKIE)?.value;
  return isValidAdminToken(headerToken) || isValidAdminToken(cookieToken);
}
