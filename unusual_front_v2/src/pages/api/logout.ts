import {NextApiRequest, NextApiResponse} from "next";
import {IErrorMessage} from "@logic/Entities";
import {serialize} from "cookie";

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


  res.setHeader("Set-Cookie", [
    serialize("token", "" , {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      expires: new Date(1970, 1,1,0,0,0,0),
    }),
    serialize("refreshToken", "", {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      expires: new Date(1970, 1,1,0,0,0,0),
    }),
  ]);


  return res.status(200).end();
}