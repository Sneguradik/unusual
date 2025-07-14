import formStyles from "@styles/FormStyles.module.scss";
import FormLayout from "@layouts/FormLayout";
import {useRouter} from "next/router";
import {Input} from "@components/ui/input";
import {cn} from "@/lib/utils";
import {Button} from "@components/ui/button";
import {useSnapshot} from "valtio/react";
import {userStore} from "@logic/Stores";
import getConfig from "next/config";
import {useState} from "react";
import {
  ICurrency,
  IErrorMessage,
  IFilterCondition,
  IFilterDescription,
  IFilterMessage, IFilterType,
  IPreset
} from "@logic/Entities";
import {toast} from "react-toastify";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import FilterBuilder from "@components/FilterBuilder";
import {Checkbox} from "@components/ui/checkbox";
import {IoIosOptions} from "react-icons/io";
import {withAuth} from "@logic/auth/withAuth";

export default function PresetEditPage({ preset, currencies, descriptions }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const isNew = preset === null;
  const verb = isNew ? "Create" : "Edit";

  const [presetState, setPresetState] = useState<IPreset>(
    preset ?? {
      id: 0,
      name: "",
      currency: { id: 0, name: "", symbol: "" },
      excludedCodes: "",
      isDefault: false,
      isPublic: false,
      filters: descriptions.map((desc) => ({
        description: desc,
        condition: IFilterCondition.Equals,
        value: 0,
        active: true,
        type: IFilterType.And,
        useTrigger: true
      } )),
      owner: { id: 0, username: "", email: "", role: "" }
    }
  );

  const user = useSnapshot(userStore);
  const router = useRouter();
  const conf = getConfig();

  const buildEditDto = () => ({
    currencyId: presetState.currency.id,
    excludedCodes: presetState.excludedCodes,
    name: presetState.name,
    isPublic: presetState.isPublic,
    isDefault: presetState.isDefault,
    filters: presetState.filters.map(f => ({
      descriptionId: f.description.id,
      condition: f.condition,
      value: f.value,
      type: f.type,
      useTrigger: f.useTrigger,
      active: f.active
    }))
  });

  const savePreset = async () => {
    const dto = buildEditDto();
    const method = isNew ? "POST" : "PUT";
    const url = isNew ? `${conf.publicRuntimeConfig.backendUrl}/preset` : `${conf.publicRuntimeConfig.backendUrl}/preset/${presetState.id}`;

    const req = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.tokenPair.token}`
      },
      body: JSON.stringify(dto)
    });

    if (!req.ok) {
      const error = await req.json() as IErrorMessage;
      toast.warn(error.detail);
      return;
    }

    toast.success(`Preset ${isNew ? "created" : "edited"} successfully!`);
    await router.push("/presets");
  };

  const deletePreset = async () => {
    const req = await fetch(`${conf.publicRuntimeConfig.backendUrl}/preset`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.tokenPair.token}`
      },
      body: JSON.stringify({ ids: [presetState.id] })
    });

    if (!req.ok) {
      const error = await req.json() as IErrorMessage;
      toast.warn(error.detail);
      return;
    }

    toast.success("Preset deleted successfully!");
    await router.push("/presets");
  };

  const handleFilterChange = (e: IFilterMessage) => {
    setPresetState(prev => ({
      ...prev,
      filters: e.filters,
      currency: e.currency,
      excludedCodes: e.excludedCodes
    }));
  };

  return (
    <FormLayout center="full">
      <main className={formStyles.container}>
        <h1 className="flex_text horizontal">
          <IoIosOptions /> {verb} preset
        </h1>

        <div className={cn(formStyles.input_block)}>
          <label htmlFor="name">Name</label>
          <Input
            name="name"
            value={presetState.name}
            onChange={e => setPresetState(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Preset name"
          />
        </div>

        <FilterBuilder
          currencies={currencies}
          descriptions={descriptions}
          value={{
            currency: presetState.currency,
            excludedCodes: presetState.excludedCodes,
            filters: presetState.filters
          }}
          onChange={handleFilterChange}
        />
        <div className={cn(formStyles.input_block)}>
          <label htmlFor="isPublic">Public Preset</label>
          <Checkbox
            id="isPublic"
            checked={presetState.isPublic}
            onCheckedChange={checked => setPresetState(prev => ({ ...prev, isPublic: !!checked }))}
          />
        </div>

        {user.role === "Admin" && (
          <div className={cn(formStyles.input_block)}>
            <label htmlFor="isDefault">Set as Default</label>
            <Checkbox
              id="isDefault"
              checked={presetState.isDefault}
              onCheckedChange={checked => setPresetState(prev => ({ ...prev, isDefault: !!checked }))}
            />
          </div>
        )}

        <div className="w-full gap-4 grid grid-cols-2">
          <Button className="w-full" onClick={savePreset}>
            {verb}
          </Button>
          {!isNew && (
            <Button className="w-full" variant="destructive" onClick={deletePreset}>
              Delete
            </Button>
          )}
        </div>
      </main>
    </FormLayout>
  );
}



export const getServerSideProps = withAuth((async (context) => {
  const conf = getConfig();
  const token = context.req.cookies["token"];

  let data: IPreset | null = null;

  if (context.query.slug !== "new") {
    const res = await fetch(`${conf.publicRuntimeConfig.backendUrl}/preset/${context.query.slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (res.ok) {
      data = await res.json() as IPreset;
    }
  }

  const currRes = await fetch(`${conf.publicRuntimeConfig.backendUrl}/currency/all`);
  const currencies = await currRes.json() as ICurrency[];

  const descRes = await fetch(`${conf.publicRuntimeConfig.backendUrl}/descriptions`);
  const descriptions = await descRes.json() as IFilterDescription[];

  return {
    props: {
      preset: data,
      currencies,
      descriptions
    }
  };
}) satisfies GetServerSideProps<{
  preset: IPreset | null;
  currencies: ICurrency[];
  descriptions: IFilterDescription[];
}>, {roles:["Admin", "User"]} );
