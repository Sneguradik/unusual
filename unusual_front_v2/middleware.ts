import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

const PUBLIC_PATHS = ["/", "/auth/login", "/api", "/favicon.ico"];

function isPublicPath(path: string): boolean {
  return PUBLIC_PATHS.some((p) => path === p || path.startsWith(p));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  if (isPublicPath(pathname)) return NextResponse.next();
  console.log("eeeee")

  if (!token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  let payload: { role?: string } = {};
  try {
    payload = jwtDecode(token);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    const loginUrl = new URL("/auth/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  const role = payload?.role;


  if ((pathname.startsWith("/currency") || pathname.startsWith("/users")) && role !== "Admin") {
    return new NextResponse("Forbidden: Admins only", { status: 403 });
  }

  if (pathname.startsWith("/presets") && !role) {
    const loginUrl = new URL("/auth/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/users/:path*",
    "/currency/:path*",
    "/presets/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
