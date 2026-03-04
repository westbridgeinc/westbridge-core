import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiSuccess, apiError, getRequestId } from "@/types/api";
import { validateCsrf } from "@/lib/csrf";
import { revokeSession, validateSession } from "@/lib/services/session.service";
import { logAction } from "@/lib/services/audit.service";
import { COOKIE } from "@/lib/constants";

export async function POST(request: Request) {
  const requestId = getRequestId(request);
  const headerToken = request.headers.get("X-CSRF-Token");
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(COOKIE.CSRF_NAME)?.value ?? null;
  const csrfOk = validateCsrf(headerToken, cookieToken);
  if (!csrfOk) {
    return NextResponse.json(
      apiError("CSRF_INVALID", "Invalid or missing CSRF token", undefined, { request_id: requestId }),
      { status: 403 }
    );
  }

  const sid = cookieStore.get(COOKIE.SESSION_NAME)?.value;
  if (sid) {
    const sessionResult = await validateSession(sid);
    if (sessionResult.ok) {
      void logAction({
        accountId: sessionResult.data.accountId,
        userId: sessionResult.data.userId,
        action: "logout",
        ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? undefined,
      });
    }
    await revokeSession(sid);
  }

  const response = NextResponse.json(
    apiSuccess({ loggedOut: true }, { request_id: requestId })
  );
  response.cookies.set(COOKIE.SESSION_NAME, "", { httpOnly: true, maxAge: 0, path: "/" });
  response.cookies.set(COOKIE.CSRF_NAME, "", { maxAge: 0, path: "/" });
  return response;
}
