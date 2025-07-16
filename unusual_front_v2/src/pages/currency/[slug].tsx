import formStyles from "@styles/FormStyles.module.scss";
import FormLayout from "@layouts/FormLayout";
import {FaDollarSign} from "react-icons/fa6";
import {useRouter} from "next/router";
import {Input} from "@components/ui/input";
import {cn} from "@/lib/utils";
import {Button} from "@components/ui/button";
import {useSnapshot} from "valtio/react";
import {userStore} from "@logic/Stores";
import getConfig from "next/config";
import {useState} from "react";
import {ICurrency, IErrorMessage} from "@logic/Entities";
import {toast} from "react-toastify";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {withAuth} from "@logic/auth/withAuth";

export default function CurrencyEditPage({currency} : InferGetServerSidePropsType<typeof getServerSideProps>) {

  const [currencyState, setCurrencyState] = useState<ICurrency>(currency?currency:{id:0, name:"", symbol: ""});
  const user = useSnapshot(userStore)
  const router = useRouter();
  const conf = getConfig();
  const verb = router.query.slug == "new"?"Create":"Edit";

  const createCurrency = async () => {
    console.log(user.tokenPair.token)
    const req = await fetch(conf.publicRuntimeConfig.backendUrl + "/currency", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.tokenPair.token}`
      },
      credentials: "include",
      body: JSON.stringify({name: currencyState.name, symbol: currencyState.symbol})
    });

    console.log(req.status);
    if (!req.ok) {
      const error = await req.json() as IErrorMessage;
      toast.warn(error.detail)
      return;
    }

    toast.success("Currency created successfully!");
    await router.push("/currency");
  }

  const updateCurrency = async () => {
    const req = await fetch(conf.publicRuntimeConfig.backendUrl + `/currency/${currencyState.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.tokenPair.token}`
      },
      credentials: "include",
      body: JSON.stringify({name: currencyState.name, symbol: currencyState.symbol})
    });

    if (!req.ok) {
      const error = await req.json() as IErrorMessage;
      toast.warn(error.detail)
      return;
    }

    toast.success("Currency edited successfully!");
    await router.push("/currency");
  }

  const deleteCurrency = async () => {
    const req = await fetch(conf.publicRuntimeConfig.backendUrl + `/currency`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.tokenPair.token}`
      },
      credentials: "include",
      body: JSON.stringify({ids:[currencyState.id]})
    });

    if (!req.ok) {
      const error = await req.json() as IErrorMessage;
      toast.warn(error.detail)
      return;
    }

    toast.success("Currency deleted successfully!");
    await router.push("/currency");

  }

  return (
    <FormLayout center={"full"} >
      <main className={formStyles.container}>
        <h1 className="flex_text horizontal"><FaDollarSign/>{verb} currency</h1>
        <div className={cn(formStyles.input_block)}>
          <label htmlFor={"name"}>Name</label>
          <Input name={"name"}
                 value={currencyState.name}
                 onChange={e=>
                   setCurrencyState(prev=> {return {...prev, name: e.target.value}})}
                 placeholder={"Currency name"}/>
        </div>

        <div className={cn(formStyles.input_block)}>
          <label htmlFor={"name"}>Symbol</label>
          <Input name={"name"}
                 value={currencyState.symbol}
                 onChange={e=>
                   setCurrencyState(prev=> {return {...prev, symbol: e.target.value}})}
                 placeholder={"Symbol for currency"}/>
          <p>Currency symbol is case sensitive. USD  is no the same as usd.</p>
        </div>

        <div className={"w-full gap-4 grid grid-cols-2"}>
          <Button className={"w-full"} onClick={()=>verb=="Create"?createCurrency():updateCurrency()}>{verb}</Button>
          <Button className={"w-full"} variant={"destructive"} onClick={deleteCurrency}>Delete</Button>
        </div>


      </main>
    </FormLayout>
  )
}

export const getServerSideProps = withAuth((async (context) => {
  const conf = getConfig();

  let data : ICurrency|null;

  if(context.query.slug != "new"){
    const res = await fetch(conf.serverRuntimeConfig.serverBackendUrl+`/currency/${context.query.slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "omit",
    });
    data = await res.json() as ICurrency;
  }
  else data = null



  return { props: { currency:data}};
}) satisfies GetServerSideProps<{currency: ICurrency|null}>, {roles:["Admin"]})