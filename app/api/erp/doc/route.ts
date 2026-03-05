import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateSession } from "@/lib/services/session.service";
import { logAction } from "@/lib/services/audit.service";
import { getDoc, createDoc } from "@/lib/services/erp.service";
import { apiSuccess, apiError, apiMeta, getRequestId } from "@/types/api";
import { erpDocCreateBodySchema } from "@/types/schemas/erp";
import { validateCsrf, CSRF_COOKIE_NAME } from "@/lib/csrf";
import { COOKIE } from "@/lib/constants";

async function getErpSession(
  request: Request
): Promise<{ sid: string; accountId: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE.SESSION_NAME)?.value;
  if (!token) return null;
  const result = await validateSession(token);
  if (!result.ok || !result.data.erpnextSid) return null;
  return { sid: result.data.erpnextSid, accountId: result.data.accountId };
}

async function getSessionForAudit(request: Request): Promise<{ userId: string; accountId: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE.SESSION_NAME)?.value;
  if (!token) return null;
  const result = await validateSession(token);
  if (!result.ok) return null;
  return { userId: result.data.userId, accountId: result.data.accountId };
}

/**
 * GET /api/erp/doc?doctype=Sales%20Invoice&name=SINV-001
 */
export async function GET(request: Request) {
  const requestId = getRequestId(request);
  const meta = () => apiMeta({ request_id: requestId });

  const session = await getErpSession(request);
  if (!session) {
    return NextResponse.json(
      apiError("UNAUTHORIZED", "Unauthorized", undefined, meta()),
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const doctype = searchParams.get("doctype");
  const name = searchParams.get("name");
  if (!doctype || !name) {
    return NextResponse.json(
      apiError("BAD_REQUEST", "doctype and name required", undefined, meta()),
      { status: 400 }
    );
  }

  const result = await getDoc(doctype, name, session.sid, session.accountId);
  if (!result.ok) {
    const status = result.error === "Not found" ? 404 : 502;
    return NextResponse.json(
      apiError("ERP_ERROR", result.error, undefined, meta()),
      { status }
    );
  }
  return NextResponse.json(apiSuccess(result.data, meta()));
}

/**
 * POST /api/erp/doc — create a new document. Body: { doctype, ...fields }
 */
export async function POST(request: Request) {
  const requestId = getRequestId(request);
  const meta = () => apiMeta({ request_id: requestId });

  const session = await getErpSession(request);
  if (!session) {
    return NextResponse.json(
      apiError("UNAUTHORIZED", "Unauthorized", undefined, meta()),
      { status: 401 }
    );
  }

  const cookieStore = await cookies();
  const csrfCookie = cookieStore.get(CSRF_COOKIE_NAME)?.value;
  const csrfHeader = request.headers.get("x-csrf-token") ?? request.headers.get("X-CSRF-Token");
  if (!validateCsrf(csrfHeader, csrfCookie)) {
    return NextResponse.json(
      apiError("FORBIDDEN", "Invalid or missing CSRF token.", undefined, meta()),
      { status: 403 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      apiError("INVALID_JSON", "Invalid JSON", undefined, meta()),
      { status: 400 }
    );
  }

  const parsed = erpDocCreateBodySchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const message = (first.doctype as string[])?.[0] ?? "Invalid request";
    return NextResponse.json(
      apiError("VALIDATION_ERROR", message, undefined, meta()),
      { status: 400 }
    );
  }

  const { doctype, ...data } = parsed.data as { doctype: string; [k: string]: unknown };
  const result = await createDoc(doctype, session.sid, data as Record<string, unknown>, session.accountId);
  if (!result.ok) {
    return NextResponse.json(
      apiError("ERP_ERROR", result.error, undefined, meta()),
      { status: 502 }
    );
  }
  const auditSession = await getSessionForAudit(request);
  if (auditSession) {
    const created = result.data as { name?: string };
    void logAction({
      accountId: auditSession.accountId,
      userId: auditSession.userId,
      action: "erp.doc.create",
      resource: doctype,
      resourceId: created?.name ?? undefined,
    });
  }
  return NextResponse.json(apiSuccess(result.data, meta()));
}
