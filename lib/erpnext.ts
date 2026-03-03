const ERPNEXT_URL = process.env.ERPNEXT_URL || "http://localhost:8080";

export async function erpnextFetch(
  endpoint: string,
  sessionId?: string,
  options?: RequestInit
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (sessionId) {
    headers["Cookie"] = `sid=${sessionId}`;
  }

  try {
    const res = await fetch(`${ERPNEXT_URL}/api${endpoint}`, {
      ...options,
      headers: { ...headers, ...(options?.headers as Record<string, string>) },
      cache: "no-store",
    });

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("ERPNext API error:", error);
    return null;
  }
}

export async function getList(
  doctype: string,
  sessionId: string,
  params?: Record<string, string>
) {
  const query = new URLSearchParams({
    limit_page_length: "20",
    order_by: "creation desc",
    ...params,
  }).toString();
  const data = await erpnextFetch(`/resource/${doctype}?${query}`, sessionId);
  return data?.data ?? [];
}

export async function getDoc(
  doctype: string,
  name: string,
  sessionId: string
) {
  const data = await erpnextFetch(`/resource/${doctype}/${name}`, sessionId);
  return data?.data ?? null;
}

export async function createDoc(
  doctype: string,
  body: Record<string, unknown>,
  sessionId: string
) {
  return erpnextFetch(`/resource/${doctype}`, sessionId, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
