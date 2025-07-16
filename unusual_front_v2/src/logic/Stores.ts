import {proxy} from "valtio/vanilla";
import {ITokenPair, IAuthenticatedUser} from "@logic/Entities";


export const userStore = proxy<IAuthenticatedUser>({
  id:0,
  username:"",
  email: "",
  role:"",
  tokenPair:{
    token:"",
    refreshToken:""
  }
});



export function setUserStore(user : IAuthenticatedUser) {
  userStore.id = user.id;
  userStore.username = user.username;
  userStore.email = user.email;
  userStore.role = user.role;
  userStore.tokenPair.token = user.tokenPair.token;
  userStore.tokenPair.refreshToken = user.tokenPair.refreshToken;
}

export function setTokens(tokens: ITokenPair) {
  userStore.tokenPair.token = tokens.token;
  userStore.tokenPair.refreshToken = tokens.refreshToken;
}