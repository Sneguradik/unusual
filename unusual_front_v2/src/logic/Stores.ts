import {proxy, subscribe} from "valtio/vanilla";
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

export const userStoreTokenSubscription = subscribe(userStore.tokenPair, () => {
  setTimeout(()=>{
    fetch("/api/refresh",{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({refreshToken:userStore.tokenPair.refreshToken})
    })
      .then((res)=>{
        res.json().then(data=> setTokens(data));
      })
      .catch(error=>console.error(error));
  },600*1000)
})

export function setUserStore(user : IAuthenticatedUser) {
  userStore.id = user.id;
  userStore.username = user.username;
  userStore.email = user.email;
  userStore.role = user.role;
  userStore.tokenPair.token = user.tokenPair.token;
  userStore.tokenPair.refreshToken = user.tokenPair.refreshToken;
}

function setTokens(tokens: ITokenPair) {
  userStore.tokenPair.token = tokens.token;
  userStore.tokenPair.refreshToken = tokens.refreshToken;
}