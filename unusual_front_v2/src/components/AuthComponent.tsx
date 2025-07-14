import {useLayoutEffect} from "react";
import {setUserStore, userStore} from "@logic/Stores";
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

  return (<></>)
}