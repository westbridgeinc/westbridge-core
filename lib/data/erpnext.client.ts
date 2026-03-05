/**
 * Data layer: ERPNext API client. Pure I/O; no business logic or formatting.
 * All ERPNext communication in the app goes through this client.
 */

import { Result, ok, err } from "@/lib/utils/result";

const ERPNEXT_URL = process.env.ERPNEXT_URL || "http://localhost:8080";

const ACCOUNT_HEADER = "X-Westbridge-Account-Id";

async function fetchErp(
  endpoint: string,
  sessionId: string | undefined,
  options?: RequestInit,
  accountId?: string
): Promise<Result<unknown, string>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };
  if (sessionId) headers["Cookie"] = `sid=${sessionId}`;
  if (accountId) headers[ACCOUNT_HEADER] = accountId;

  try {
    const res = await fetch(`${ERPNEXT_URL}/api${endpoint}`, {
      ...options,
      headers,
      cache: "no-store",
    });
    if (!res.ok) return err(`ERPNext ${res.status}: ${res.statusText}`);
    const data = await res.json();
    return ok(data);
  } catch (e) {
    return err(e instanceof Error ? e.message : "ERPNext request failed");
  }
}

export interface ListParams {
  limit_page_length?: string;
  limit_start?: string;
  order_by?: string;
  fields?: string;
  filters?: string;
}

/**
 * List ERP documents. When accountId is set (multi-tenant), caller should
 * ensure ERPNext is configured per-account (e.g. company filter) so results
 * are scoped to that account (row-level security).
 */
export async function erpList(
  doctype: string,
  sessionId: string,
  params?: ListParams,
  accountId?: string
): Promise<Result<unknown[], string>> {
  const query = new URLSearchParams({
    limit_page_length: "20",
    order_by: "creation desc",
    ...params,
  }).toString();
  const result = await fetchErp(`/resource/${doctype}?${query}`, sessionId, undefined, accountId);
  if (!result.ok) return err(result.error);
  const body = result.data as { data?: unknown[] };
  return ok(Array.isArray(body?.data) ? body.data : []);
}

export async function erpGet(
  doctype: string,
  name: string,
  sessionId: string,
  accountId?: string
): Promise<Result<unknown, string>> {
  const result = await fetchErp(
    `/resource/${doctype}/${encodeURIComponent(name)}`,
    sessionId,
    undefined,
    accountId
  );
  if (!result.ok) return err(result.error);
  const body = result.data as { data?: unknown };
  return body?.data != null ? ok(body.data) : err("Not found");
}

export async function erpCreate(
  doctype: string,
  sessionId: string,
  body: Record<string, unknown>,
  accountId?: string
): Promise<Result<unknown, string>> {
  return fetchErp(
    `/resource/${doctype}`,
    sessionId,
    { method: "POST", body: JSON.stringify(body) },
    accountId
  );
}

export async function erpUpdate(
  doctype: string,
  name: string,
  sessionId: string,
  updates: Record<string, unknown>,
  accountId?: string
): Promise<Result<unknown, string>> {
  return fetchErp(
    `/resource/${doctype}/${encodeURIComponent(name)}`,
    sessionId,
    { method: "PUT", body: JSON.stringify(updates) },
    accountId
  );
}
