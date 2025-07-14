import styles from "./Auth.module.scss";
import FormLayout from "@layouts/FormLayout";
import {Input} from "@components/ui/input";
import {cn} from "@/lib/utils";
import {MdAlternateEmail, MdKey} from "react-icons/md";
import {Button} from "@components/ui/button";
import {Checkbox} from "@components/ui/checkbox";
import {FormEvent, useState} from "react";
import {toast} from "react-toastify";
import {IErrorMessage, IAuthenticatedUser} from "@logic/Entities";
import {useRouter} from "next/router";
import {setUserStore} from "@logic/Stores";

export default function LoginPage(){

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  async function onSubmit(event: FormEvent<HTMLFormElement>){
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);

    const req = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({email: formData.get("email"), password: formData.get("password"), remember: formData.get("remember")}),
    });

    if (!req.ok){
      const err = await req.json() as IErrorMessage;
      toast.error(err.detail);
      setIsLoading(false);
      return
    }

    const data = await req.json() as IAuthenticatedUser;

    setUserStore(data);
    setIsLoading(false);
    await router.push("/");
  }

  return (
    <FormLayout>
      <form className={styles.container} onSubmit={onSubmit} method="POST">
        <h2>Login</h2>
        <hr/>
        <p className={"text-muted-foreground"}>Учетную запись можно получить у администратора системы.</p>
        <div className={cn("flex_text vertical")}>
          <h6 className={"flex_text horizontal"}><MdAlternateEmail />Email</h6>
          <Input placeholder={"user@example.com"} name={"email"} disabled={isLoading}/>
        </div>
        <div className={cn("flex_text vertical")}>
          <h6 className={"flex_text horizontal"}><MdKey />Password</h6>
          <Input type="password" placeholder={"password"} name={"password"} disabled={isLoading}/>
        </div>

        <div className={"flex_text horizontal mt-4 mb-2"}>
          <Checkbox name={"remember"} disabled={isLoading}/>
          <text>Remember me</text>
        </div>

        <Button type={"submit"} disabled={isLoading}>Login</Button>

      </form>
    </FormLayout>
  );
}