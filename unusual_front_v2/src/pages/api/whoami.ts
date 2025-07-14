import {NextApiRequest, NextApiResponse} from "next";
import {IErrorMessage, ITokenPair, IAuthenticatedUser} from "@logic/Entities";
import {serialize} from "cookie";
import getConfig from "next/config";
import {decodeJwt} from "@logic/auth/decodeJwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    const err_msg : IErrorMessage = {
      title: "Method not allowed",
      status: 405,
      detail: "Only GET method allowed for this route.",
      instance : "/api/logout",
    }
    return res.status(405).json(err_msg);
  }
  const {serverRuntimeConfig ,publicRuntimeConfig} = getConfig();
  const cks = req.cookies;

  if(!cks["refreshToken"]) {
    const err: IErrorMessage = {
      title: "Unauthorized",
      status: 401,
      detail : "You have no auth cookies",
      instance : "/api/whoami",
    };
    return res.status(401).json(err);
  }

  const backReq = await fetch(publicRuntimeConfig.backendUrl+"/auth/refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({refreshToken: cks["refreshToken"]}),
  });

  if (!backReq.ok){
    const error = await backReq.json() as IErrorMessage;
    return res.status(error.status).json(error);
  }

  const tokenPair = await backReq.json() as ITokenPair;

  if (req.cookies.refreshToken && tokenPair) {
    res.setHeader("Set-Cookie", [
      serialize("token", tokenPair.token , {
        httpOnly: true,
        path: "/",
        sameSite: "strict",
        maxAge: serverRuntimeConfig.tokenValidityInSeconds,
      }),
      serialize("refreshToken", tokenPair.refreshToken, {
        httpOnly: true,
        path: "/",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * serverRuntimeConfig.refreshTokenValidityInDays,
      }),
    ]);
  }
  const tokensPayload = decodeJwt(tokenPair.token);

  if (!tokensPayload.payload || !tokensPayload.valid) return res.status(500);

  const user: IAuthenticatedUser = {
    id: tokensPayload.payload.sub,
    username: tokensPayload.payload.name,
    email: tokensPayload.payload.email,
    role: tokensPayload.payload.role,
    tokenPair : tokenPair
  }

  return res.status(200).json(user);
}