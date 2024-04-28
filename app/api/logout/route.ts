import { NextRequest, NextResponse } from "next/server";
import getSession from "../../../lib/session";

export async function POST(request: NextRequest) {
  const response = NextResponse.next();
  const session = await getSession();
  await session.destroy();
  return NextResponse.json({ ok: true });
}
