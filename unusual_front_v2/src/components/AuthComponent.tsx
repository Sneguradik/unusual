import {useEffect} from "react";
import {setTokens, setUserStore, userStore} from "@logic/Stores";
import {useSnapshot} from "valtio/react";

export default function AuthComponent() {
  const user = useSnapshot(userStore);

  useEffect(() => {
    if (user.id !== 0) return;

    fetch("/api/whoami", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) return;
        return res.json();
      })
      .then((data) => {
        if (data) {
          setUserStore(data);
        }
      })
      .catch((err) => console.error("WhoAmI error", err));
  }, [user.id]);


  useEffect(() => {
    if (!user.tokenPair?.refreshToken) return;

    const interval = setInterval(() => {
      fetch("/api/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          refreshToken: user.tokenPair.refreshToken,
        }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Refresh failed");
          return res.json();
        })
        .then((data) => {
          setTokens(data);
        })
        .catch((err) => {
          console.error("Refresh error", err);
        });
    }, 10 * 60 * 1000); // 10 минут

    return () => clearInterval(interval);
  }, [user.tokenPair?.refreshToken]);

  return null;
}