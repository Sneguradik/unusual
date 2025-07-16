import {useEffect, useLayoutEffect} from "react";
import {setTokens, setUserStore, userStore} from "@logic/Stores";
import {useSnapshot} from "valtio/react";

export default function AuthComponent() {

  const user = useSnapshot(userStore);
  useLayoutEffect( () => {
    if(user.id != 0) return;
    fetch("/api/whoami",{
      method: "GET",
      credentials: "include",
    })
      .then(res=>{
        if(!res.ok) return;
        res.json()
          .then(data=>setUserStore(data))
      })
      .catch(err => console.log(err));
  }, [user])

  useEffect(() => {
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
  }, []);

  return (<></>)
}