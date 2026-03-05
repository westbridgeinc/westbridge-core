import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateSession } from "@/lib/services/session.service";
import { list } from "@/lib/services/erp.service";
import { parseAndValidateFilters } from "@/lib/validation/erp-filters";
import { apiSuccess, apiError, apiMeta, getRequestId } from "@/types/api";
import { COOKIE } from "@/lib/constants";

/**
 * GET /api/erp/list?doctype=Sales%20Invoice
 * Returns list of records from ERPNext. Requires auth cookie.
 */
export async function GET(request: Request) {
  const requestId = getRequestId(request);
  const meta = () => apiMeta({ request_id: requestId });

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE.SESSION_NAME)?.value;
  if (!token) {
    return NextResponse.json(
      apiError("UNAUTHORIZED", "Unauthorized", undefined, meta()),
      { status: 401 }
    );
  }
  const sessionResult = await validateSession(token);
  if (!sessionResult.ok) {
    return NextResponse.json(
      apiError("UNAUTHORIZED", sessionResult.error, undefined, meta()),
      { status: 401 }
    );
  }
  const { accountId, erpnextSid } = sessionResult.data;
  if (!erpnextSid) {
    return NextResponse.json(
      apiError("UNAUTHORIZED", "ERP session not available. Please log in again.", undefined, meta()),
      { status: 401 }
    );
  }
  const sid = erpnextSid;

  const { searchParams } = new URL(request.url);
  const doctype = searchParams.get("doctype");
  if (!doctype) {
    return NextResponse.json(
      apiError("BAD_REQUEST", "doctype required", undefined, meta()),
      { status: 400 }
    );
  }

  const limit = searchParams.get("limit") ?? "20";
  const offset = searchParams.get("offset") ?? "0";
  const orderBy = searchParams.get("order_by") ?? "creation desc";
  const fields = searchParams.get("fields");
  const filtersParam = searchParams.get("filters");

  const filtersResult = parseAndValidateFilters(filtersParam);
  if (!filtersResult.ok) {
    return NextResponse.json(
      apiError("BAD_REQUEST", filtersResult.error, undefined, meta()),
      { status: 400 }
    );
  }

  const params: Record<string, string> = {
    limit_page_length: limit,
    limit_start: offset,
    order_by: orderBy,
  };
  if (fields) params.fields = JSON.stringify(fields.split(",").map((f) => f.trim()));
  if (filtersResult.filters !== "[]") params.filters = filtersResult.filters;

  const result = await list(doctype, sid, params, accountId ?? undefined);
  if (!result.ok) {
    const status = result.error === "doctype required" ? 400 : 502;
    return NextResponse.json(
      apiError("ERP_ERROR", result.error, undefined, meta()),
      { status }
    );
  }
  return NextResponse.json(apiSuccess(result.data, meta()));
}
