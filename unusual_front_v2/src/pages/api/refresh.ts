import {NextApiRequest, NextApiResponse} from "next";
import { IErrorMessage, ITokenPair} from "@logic/Entities";
import getConfig from "next/config";
import {serialize} from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== "POST") {
    const err_msg : IErrorMessage = {
      title: "Method not allowed",
      status: 405,
      detail: "Only POST method allowed for this route.",
      instance : "/api/refresh",
    }
    return res.status(405).json(err_msg);
  }
  const conf = getConfig();

  const data = req.body ;

  const backReq = await fetch(conf.serverRuntimeConfig.serverBackendUrl+"/auth/refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
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
        maxAge: conf.serverRuntimeConfig.tokenValidityInSeconds,
      }),
      serialize("refreshToken", tokenPair.refreshToken, {
        httpOnly: true,
        path: "/",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * conf.serverRuntimeConfig.refreshTokenValidityInDays,
      }),
    ]);
  }

  return res.status(200).json(tokenPair);
}