import {NextApiRequest, NextApiResponse} from "next";
import getConfig from "next/config";
import {IClientLoginCredentials, IErrorMessage, IAuthenticatedUser} from "@logic/Entities";
import { serialize } from "cookie";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    const err_msg : IErrorMessage = {
      title: "Method not allowed",
      status: 405,
      detail: "Only POST method allowed for this route.",
      instance : "/api/login",
    }
    return res.status(405).json(err_msg);
  }

  const conf = getConfig();


  const data = JSON.parse(req.body) as IClientLoginCredentials;


  const backReq = await fetch(conf.serverRuntimeConfig.serverBackendUrl+"/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "omit",
    body: JSON.stringify({email:data.email, password:data.password}),
  });

  if (!backReq.ok){
    const error = await backReq.json() as IErrorMessage;
    return res.status(error.status).json(error);
  }

  const user = await backReq.json() as IAuthenticatedUser;

  if (data.remember == "on"){
    res.setHeader("Set-Cookie", [
      serialize("token", user.tokenPair.token , {
        httpOnly: true,
        path: "/",
        sameSite: "strict",
        maxAge: conf.serverRuntimeConfig.tokenValidityInSeconds,
      }),
      serialize("refreshToken", user.tokenPair.refreshToken, {
        httpOnly: true,
        path: "/",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * conf.serverRuntimeConfig.refreshTokenValidityInDays,
      }),
    ]);
  }

  return res.status(200).json(user);
}