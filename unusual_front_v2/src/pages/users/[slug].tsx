import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import getConfig from "next/config";
import { useSnapshot } from "valtio";
import { toast } from "react-toastify";
import { IUser, IErrorMessage } from "@logic/Entities";
import { userStore } from "@logic/Stores";
import {Input} from "@components/ui/input";
import {Button} from "@components/ui/button";
import  FormLayout  from "@layouts/FormLayout";
import formStyles from "@styles/FormStyles.module.scss";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {FaCircleUser} from "react-icons/fa6";
import {withAuth} from "@logic/auth/withAuth";

export default function UsersEditPage({userData}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const user = useSnapshot(userStore);
  const conf = getConfig();

  const verb = router.query.slug === "new" ? "Create" : "Edit";


  const [userState, setUserState] = useState<IUser>(
    userData ?? {id: 0, username: "", email: "", role: ""}
  );
  const [password, setPassword] = useState("");

  const createUser = async () => {
    const req = await fetch(conf.publicRuntimeConfig.backendUrl + "/users/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.tokenPair.token}`,
      },
      credentials: "include",
      body: JSON.stringify({
        username: userState.username,
        email: userState.email,
        password: password,
      }),
    });

    if (!req.ok) {
      console.log(req.status)
      console.log({
        username: userState.username,
        email: userState.email,
        password: password,
      });
      const error = (await req.json()) as IErrorMessage;
      toast.warn(error.detail);
      return;
    }

    toast.success("User created successfully!");
    await router.push("/users");
  };

  const updateUser = async () => {
    const req = await fetch(conf.publicRuntimeConfig.backendUrl + `/users/${userState.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.tokenPair.token}`,
      },
      credentials: "include",
      body: JSON.stringify({
        newEmail: userState.email,
        newName: userState.username,
      }),
    });

    if (!req.ok) {
      const error = (await req.json()) as IErrorMessage;
      toast.warn(error.detail);
      return;
    }

    toast.success("User edited successfully!");
    await router.push("/users");
  };

  const deleteUser = async () => {
    const req = await fetch(conf.publicRuntimeConfig.backendUrl + `/users/${userState.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.tokenPair.token}`,
      },
      credentials: "include",
    });

    if (!req.ok) {
      const error = (await req.json()) as IErrorMessage;
      toast.warn(error.detail);
      return;
    }

    toast.success("User deleted successfully!");
    await router.push("/users");
  };

  const setToRole = async () => {
    const req = await fetch(conf.publicRuntimeConfig.backendUrl + `/users/set_role/${userState.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.tokenPair.token}`
      },
      credentials: "include",
      body: JSON.stringify({
        role: userState.role
      })
    });

    if (!req.ok) {
      const error = await req.json() as IErrorMessage;
      toast.warn(error.detail);
      return;
    }

    toast.success("Role changed successfully!");
  }

  return (
    <FormLayout>
      <main className={formStyles.container}>
        <h1 className="flex_text horizontal">
          <FaCircleUser/>
          {verb} user
        </h1>

        <div className={formStyles.input_block}>
          <label>Username</label>
          <Input
            name={"username"}
            value={userState.username}
            onChange={(e) =>
              setUserState((prev) => ({...prev, username: e.target.value}))
            }
            placeholder={"Username"}
          />
        </div>

        <div className={formStyles.input_block}>
          <label>Email</label>
          <Input
            name={"email"}
            value={userState.email}
            onChange={(e) =>
              setUserState((prev) => ({...prev, email: e.target.value}))
            }
            placeholder={"User's email"}
          />
        </div>

        <div className={formStyles.input_block}>
          <label>Password</label>
          <Input
            name={"password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={"Password"}
          />
        </div>

        {verb !== "Create" ? (
          <div className={"w-full flex gap-4"}>
            <Select
              onValueChange={(value) =>
                setUserState((prev) => ({...prev, role: value}))
              }
              defaultValue={userState.role}
            >
              <SelectTrigger>
                <SelectValue placeholder={"Select role"}/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"Admin"}>Admin</SelectItem>
                <SelectItem value={"User"}>User</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={setToRole}>Change role</Button>
          </div>
        ) : null}

        <div
          className={cn(
            "w-full gap-4 grid ",
            verb === "Create" ? "grid-cols-1" : "grid-cols-2"
          )}
        >
          <Button
            className={"w-full"}
            onClick={() => (verb === "Create" ? createUser() : updateUser())}
          >
            {verb}
          </Button>
          {verb !== "Create" ? (
            <Button
              className={"w-full"}
              variant={"destructive"}
              onClick={deleteUser}
            >
              Delete
            </Button>
          ) : null}
        </div>
      </main>
    </FormLayout>
  );
}



export const getServerSideProps = withAuth((async (context) => {
  const conf = getConfig();
  const slug = context.query.slug;

  const cookie = context.req.cookies;

  const token= cookie["token"];



  let data: IUser | null = null;

  if (slug !== "new") {
    const res = await fetch(conf.serverRuntimeConfig.serverBackendUrl + `/users/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      credentials: "include",
    });

    console.log(res.status);

    if (!res.ok) {
      return {
        notFound: true,
      };
    }

    data = (await res.json()) as IUser;
  }

  return { props: { userData: data } };
}) satisfies GetServerSideProps<{ userData: IUser | null }>,{roles : ["Admin"]});
