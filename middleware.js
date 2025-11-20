// middleware.js (at project root)
import { NextResponse } from "next/server";

export function middleware(req) {
  const url = new URL(req.url);
  const m = url.pathname.match(/^\/products\/([^/]+)\/?$/);
  if (m) {
    url.pathname = `/product/${m[1]}`;
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}
