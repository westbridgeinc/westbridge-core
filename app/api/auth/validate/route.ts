import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateSession } from "@/lib/services/session.service";
import { apiSuccess, apiError, apiMeta, getRequestId } from "@/types/api";
import { COOKIE } from "@/lib/constants";

/**
 * GET /api/auth/validate — validate session cookie and return userId + accountId.
 * Returns 401 if missing or invalid. Used by dashboard or API consumers to verify session.
 */
export async function GET(request: Request) {
  const requestId = getRequestId(request);
  const meta = () => apiMeta({ request_id: requestId });
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE.SESSION_NAME)?.value;
  if (!token) {
    return NextResponse.json(
      apiError("UNAUTHORIZED", "Missing session", undefined, meta()),
      { status: 401 }
    );
  }
  const result = await validateSession(token);
  if (!result.ok) {
    return NextResponse.json(
      apiError("UNAUTHORIZED", result.error, undefined, meta()),
      { status: 401 }
    );
  }
  return NextResponse.json(
    apiSuccess(
      { userId: result.data.userId, accountId: result.data.accountId },
      meta()
    )
  );
}
