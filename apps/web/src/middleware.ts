import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkIdToken } from "./services/middleware/authMiddleware";
import { AUTH_COOKIE } from "./utils/cookieConstants";
import { CheckIdTokenResp } from "./types/authTypes";

const authProtectedRoutes = [
  "/login",
  "/signup",
  "/forgot-password",
  "/password-reset",
  "/password-rest-sent",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const idToken = request.cookies.get(AUTH_COOKIE)?.value;
  let authData: CheckIdTokenResp | undefined = undefined;
  if (!!idToken) {
    authData = await checkIdToken(idToken, request.url);
    if (!authData) request.cookies.delete(AUTH_COOKIE);
  }

  const isPrivateRutes = pathname.startsWith("/dashboard");

  if (authData) {
    const {
      decodedData: { email_verified },
    } = authData;
    const isAuthRoute = authProtectedRoutes.some((authRoute) =>
      pathname.startsWith(authRoute),
    );
    const newUrl = email_verified ? "/dashboard/home" : "/verify-email";
    if (pathname === "/" || isAuthRoute) {
      return NextResponse.redirect(new URL(newUrl, request.url));
    }
    if (isPrivateRutes && !email_verified) {
      return NextResponse.redirect(new URL("/verify-email", request.url));
    }
    const isConfirmEmailPage = pathname.startsWith("/confirm-email");
    if (isConfirmEmailPage && email_verified) {
      return NextResponse.redirect(new URL("/dashboard/home", request.url));
    }
    return NextResponse.next();
  } else {
    const isVerifyEmail = pathname.startsWith("/verify-email");
    if (isPrivateRutes || isVerifyEmail) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // if (pathname.startsWith("/api")) {
  //   console.log("It is an api call");
  // }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/",
    "/api/:path*",
    "/dashboard/:path*",
    "/login",
    "/signup",
    "/forgot-password",
    "/password-reset",
    "/password-rest-sent",
    "/confirm-email",
    "/verify-email",
  ],
};
