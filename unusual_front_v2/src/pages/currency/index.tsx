import MainLayout from "@layouts/MainLayout";
import {FaDollarSign} from "react-icons/fa6";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@components/ui/table";
import {Button} from "@components/ui/button";
import {ICurrency} from "@logic/Entities";
import {useRouter} from "next/router";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import getConfig from "next/config";
import {withAuth} from "@logic/auth/withAuth";



export default function CurrencyPage({currencies}:InferGetServerSidePropsType<typeof getServerSideProps>) {

  const router = useRouter();

  return(
    <MainLayout>

      <main className={"max-w-1440 w-full flex flex-col gap-4"}>
        <h1 className="flex_text horizontal"><FaDollarSign/>Currency</h1>
        <div className={"w-full flex justify-end"}>
          <Button onClick={()=>router.push("/currency/new")}>New currency</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead>Id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead className="text-right w-[3rem]">Action</TableHead>
            </TableRow>

          </TableHeader>
          <TableBody>
            {currencies.map((currency, index) => {
              return (<CurrencyTableItem currency={currency} key={index} />)
            })}

          </TableBody>
        </Table>
      </main>
    </MainLayout>
  )
}

function CurrencyTableItem({currency}: {currency: ICurrency}) {
  const router = useRouter();

  return (
    <TableRow>
      <TableCell>{currency.id}</TableCell>
      <TableCell>{currency.name}</TableCell>
      <TableCell>{currency.symbol}</TableCell>
      <TableCell >
        <Button onClick={()=>router.push(`/currency/${currency.id}`)}>Edit</Button>
      </TableCell>
    </TableRow>
  )
}


export const getServerSideProps = withAuth((async () => {
  const conf = getConfig();
  const res = await fetch(conf.publicRuntimeConfig.backendUrl+"/currency/all", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "omit",
  });
  const data = await res.json() as ICurrency[];

  return { props: { currencies:data}};
}) satisfies GetServerSideProps<{currencies: ICurrency[]}>, {roles:["Admin"]})