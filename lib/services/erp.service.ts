/**
 * ERP service: list and doc operations. Delegates to data layer.
 */

import {
  erpList,
  erpGet,
  erpCreate,
  erpUpdate,
  type ListParams,
} from "@/lib/data/erpnext.client";
import type { Result } from "@/lib/utils/result";

/**
 * List ERP documents. When accountId is present (multi-tenant), the data layer
 * should scope results to that account's company/site (row-level security).
 */
export async function list(
  doctype: string,
  sessionId: string,
  params?: ListParams,
  accountId?: string
): Promise<Result<unknown[], string>> {
  if (!doctype?.trim()) return { ok: false, error: "doctype required" };
  return erpList(doctype, sessionId, params, accountId);
}

export async function getDoc(
  doctype: string,
  name: string,
  sessionId: string
): Promise<Result<unknown, string>> {
  if (!doctype?.trim() || !name?.trim()) return { ok: false, error: "doctype and name required" };
  return erpGet(doctype, name, sessionId);
}

export async function createDoc(
  doctype: string,
  sessionId: string,
  body: Record<string, unknown>
): Promise<Result<unknown, string>> {
  if (!doctype?.trim()) return { ok: false, error: "doctype required" };
  return erpCreate(doctype, sessionId, body);
}

export async function updateDoc(
  doctype: string,
  name: string,
  sessionId: string,
  updates: Record<string, unknown>
): Promise<Result<unknown, string>> {
  if (!doctype?.trim() || !name?.trim()) return { ok: false, error: "doctype and name required" };
  return erpUpdate(doctype, name, sessionId, updates);
}
