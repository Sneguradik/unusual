import styles from "./Header.module.scss";
import Link from "next/link";
import {TiHome} from "react-icons/ti";
import {IoIosLogOut, IoIosOptions} from "react-icons/io";
import {Button} from "@components/ui/button";
import {useSnapshot} from "valtio/react";
import {setUserStore, userStore} from "@logic/Stores";
import {FaCircleUser, FaDollarSign} from "react-icons/fa6";
import {toast} from "react-toastify";
import {useRouter} from "next/router";

export default function Header() {

  const user = useSnapshot(userStore);
  const router = useRouter();

  const logout = async () => {
    const res = await fetch("/api/logout", {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) toast.warn(res.statusText)
    setUserStore({
      id:0,
      username: "",
      email : "",
      role: "",
      tokenPair : {token:"", refreshToken: ""}
    });
    await router.push("/")
  }

  return(
    <header className={styles.container}>
      <div className={styles.pages}>
        <Link className={styles.page_link} href="/"><TiHome /><h5>Home</h5></Link>
        {user.id != 0?<>
          <Link className={styles.page_link} href={"/presets"}><IoIosOptions /><h5>Presets</h5></Link>
          {user.role === "Admin"?<>
            <Link className={styles.page_link} href={"/currency"}><FaDollarSign /><h5>Currency</h5></Link>
            <Link className={styles.page_link} href={"/users"}><FaCircleUser /><h5>User</h5></Link>
          </>:null}
          {/*<Link className={styles.page_link} href={"/"}><IoIosSettings /><h5>Settings</h5></Link>*/}
        </> :null}
      </div>
      {user.id != 0?
        <div className={"flex flex-col gap-1"}>
          <h4>{user.username}</h4>
          <div className={"flex items-center gap-4"}>
            <span className={styles.page_link} onClick={logout}><IoIosLogOut />Log out</span>
            {/*<span className={styles.page_link}><IoIosSettings />Settings</span>*/}
          </div>
        </div>:
        <Link className={styles.page_link} href="/auth/login">
          <Button><h5>Log in</h5></Button>
        </Link>
      }

    </header>
  )
}