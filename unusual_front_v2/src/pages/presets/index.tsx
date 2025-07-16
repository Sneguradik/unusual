import MainLayout from "@layouts/MainLayout";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@components/ui/table";
import {Button} from "@components/ui/button";
import { IPreset} from "@logic/Entities";
import {useRouter} from "next/router";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import getConfig from "next/config";
import {IoIosOptions} from "react-icons/io";
import {Badge} from "@components/ui/badge";
import {decodeJwt} from "@logic/auth/decodeJwt";
import {withAuth} from "@logic/auth/withAuth";

export default function PresetsPage({presets}:InferGetServerSidePropsType<typeof getServerSideProps>) {

  const router = useRouter();

  return(
    <MainLayout>

      <main className={"max-w-1440 w-full flex flex-col gap-4"}>
        <h1 className="flex_text horizontal"><IoIosOptions />Presets</h1>

        <div className={"w-full flex justify-end"}>
          <Button onClick={()=>router.push("/presets/new")}>New preset</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead>Id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Public</TableHead>
              <TableHead>Default</TableHead>
              <TableHead className="text-right w-[3rem]">Action</TableHead>
            </TableRow>

          </TableHeader>
          <TableBody>
            {presets.map((preset, index) => {
              return (<PresetTableItem preset={preset} key={index} />)
            })}

          </TableBody>
        </Table>
      </main>
    </MainLayout>
  )
}

function PresetTableItem({preset}: {preset: IPreset}) {
  const router = useRouter();

  return (
    <TableRow>
      <TableCell>{preset.id}</TableCell>
      <TableCell>{preset.name}</TableCell>
      <TableCell>
        <div className={"flex flex-col gap-1"}>
          <span className={"font-bold"}>{preset.currency.symbol}</span>
          <small className={"text-muted-foreground"}>{preset.currency.name}</small>
        </div>
      </TableCell>
      <TableCell>
        <div className={"flex flex-col gap-1"}>
          <span className={"font-bold"}>{preset.owner.username}</span>
          <small className={"text-muted-foreground"}>{preset.owner.email}</small>
        </div>
      </TableCell>
      <TableCell><Badge>{preset.isPublic?"Public":"Private"}</Badge></TableCell>
      <TableCell>{preset.isDefault?<Badge className={"bg-blue-500 text-white"}>Default</Badge>:null}</TableCell>
      <TableCell >
        <Button onClick={()=>router.push(`/presets/${preset.id}`)}>Edit</Button>
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

  const url = user.role=="Admin"?"/preset/all":"/preset/my";
  const res = await fetch(conf.serverRuntimeConfig.serverBackendUrl + url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    credentials: "include",
  });

  const data = await res.json() as IPreset[];

  return { props: { presets:data}};
}) satisfies GetServerSideProps<{presets: IPreset[]}>, {roles:["Admin", "User"]} )