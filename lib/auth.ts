const ERPNEXT_URL = process.env.ERPNEXT_URL || "http://localhost:8080";

export async function loginToERPNext(
  email: string,
  password: string
): Promise<string> {
  const res = await fetch(`${ERPNEXT_URL}/api/method/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usr: email, pwd: password }),
  });

  if (!res.ok) throw new Error("Invalid credentials");

  const setCookie = res.headers.get("set-cookie");
  if (!setCookie) throw new Error("No session returned");

  const match = setCookie.match(/sid=([^;]+)/);
  if (!match) throw new Error("No session returned");

  return match[1];
}
