
import MainLayout from "@layouts/MainLayout";
import {Button} from "@components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@components/ui/table";
import {useRouter} from "next/router";
import {IUser} from "@logic/Entities";
import getConfig from "next/config";
import {decodeJwt} from "@logic/auth/decodeJwt";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {FaCircleUser} from "react-icons/fa6";
import {withAuth} from "@logic/auth/withAuth";

export default function UsersPage({users}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  return (
    <MainLayout>
      <main className={"max-w-1440 w-full flex flex-col gap-4"}>
        <h1 className="flex_text horizontal"><FaCircleUser />User</h1>

        <div className={"w-full flex justify-end"}>
          <Button onClick={()=>router.push("/users/new")}>New user</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead>Id</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right w-[3rem]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((value, index) => <UserTableItem user={value} key={index} />)}
          </TableBody>
        </Table>
      </main>
    </MainLayout>
  )
}

function UserTableItem({user}: {user: IUser}) {
  const router = useRouter();

  return (
    <TableRow>
      <TableCell>{user.id}</TableCell>
      <TableCell>{user.username}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <Button onClick={()=>router.push(`/users/${user.id}`)}>Edit</Button>
      </TableCell>
    </TableRow>
  )
}


export const getServerSideProps =withAuth( (async (context) => {
  const conf = getConfig();

  const cookie = context.req.cookies;
  const token = cookie["token"];
  if (!token) throw new Error("Cookie not found");
  const user = decodeJwt(token).payload;
  if (!user) throw new Error("Invalid token payload");

  const res = await fetch(conf.publicRuntimeConfig.backendUrl + "/users/all", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    credentials: "include",
  });



  const data = await res.json() as IUser[];

  return { props: { users:data}};
}) satisfies GetServerSideProps<{users: IUser[]}> , {roles:["Admin"]})