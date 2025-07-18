import jwt from "jsonwebtoken";
import {IJwtPayload} from "@logic/Entities";

const JWT_SECRET = "ghf3823dfhcbnu34yt87v58uybwe87b8723879r3vg789b";

export function decodeJwt(token: string): { valid: boolean, payload?: IJwtPayload} {
  if (JWT_SECRET  == undefined) throw Error(`Invalid JWT_SECRET token: ${token}`);
  const payload = jwt.decode(token) as unknown as IJwtPayload;
  return { valid: true,  payload};
}
