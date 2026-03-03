import { NextResponse } from "next/server";
import { loginToERPNext } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }
    const sid = await loginToERPNext(email, password);
    const response = NextResponse.json({ success: true });
    response.cookies.set("westbridge_sid", sid, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid credentials";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
