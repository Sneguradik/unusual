import { useState} from "react";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import getConfig from "next/config";
import MainLayout from "@/layouts/MainLayout";
import styles from "./Home.module.scss";
import formStyles from "@/styles/FormStyles.module.scss";
import {
  ICurrency,
  IFilterDescription,
  IPreset,
  IFilterMessage,
  ITradeStatsRequest,
  IFilterType,
  IFilterCondition, ITradeStatAnalyzed
} from "@logic/Entities";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@components/ui/accordion";
import {Badge} from "@components/ui/badge";
import {cn} from "@/lib/utils";
import {Button} from "@components/ui/button";
import TradesTable from "@components/TradesTable";
import {decodeJwt} from "@logic/auth/decodeJwt";
import {DateRange} from "react-day-picker";
import { addDays } from "date-fns";
import {ChartContainer, ChartTooltip, ChartTooltipContent} from "@components/ui/chart";
import {Area, AreaChart, CartesianGrid, Legend, XAxis} from "recharts";
import DatePickerWithRange from "@components/ui/date-picker";
import FilterBuilder from "@components/FilterBuilder";
import ChartLegendContent from "@components/ChartLegendContent";
import {getRandomColor} from "@/lib/getRandomColor";
import {downloadTradesCsv} from "@logic/downloadTradesCsv";
import {toast} from "react-toastify";

export interface DealsStatsByCurrencyDto {
  day: string;
  stats: Record<string, number>;
}


export default function Home({currencies, descriptions, presets, recentDeals}: InferGetServerSidePropsType<typeof getServerSideProps>) {

  const conf = getConfig();
  const [selectedPresetId, setSelectedPresetId] = useState<number | null>(null);
  const [tableData, setTableData] = useState<ITradeStatAnalyzed[]>([]);
  const [filterState, setFilterState] = useState<IFilterMessage>({
    currency: currencies[0],
    excludedCodes: "",
    filters: descriptions.map((desc) => ({
      description: desc,
      condition: IFilterCondition.Equals,
      value: 0,
      active: true,
      type: IFilterType.And,
      useTrigger: true
    }))
  });

  const [dateRange, setDateRange] = useState<DateRange>({
    from: addDays(new Date(), -7),
    to: new Date()
  });


  const handlePresetClick = (preset: IPreset) => {
    setSelectedPresetId(preset.id);
    setFilterState({
      currency: preset.currency,
      excludedCodes: preset.excludedCodes,
      filters: preset.filters
    });
  };

  const handleFilterChange = (value: IFilterMessage) => {
    setFilterState(value);
    setSelectedPresetId(null);
  };

  const handleSearch = async () => {
    if (!dateRange.from || !dateRange.to) return;

    const request: ITradeStatsRequest = {
      startDate: dateRange.from.toISOString(),
      endDate: dateRange.to.toISOString(),
      currency: filterState.currency.symbol,
      excludedCodes: filterState.excludedCodes,
      filters: filterState.filters,
      presetId: selectedPresetId
    };

    try {
      const promise = fetch(`${conf.publicRuntimeConfig.backendUrl}/filter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
      }).then(async res => {
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.detail ?? "Server error");
        }
        return await res.json() as Promise<ITradeStatAnalyzed[]>;
      });

      const data = await toast.promise(promise, {
        pending: 'Фильтруем сделки',
        success: 'Сделки успешно отфильтрованы',
        error: 'Не удалось отфильтровать сделки'
      });

      console.log("Filtered stats:", data);
      setTableData(data);

    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const chartData = recentDeals.map(d => ({
    day: dayMap[new Date(d.day).getUTCDay()],
    stats: d.stats
  }));
  const chartConfig = Object.keys(chartData[0]?.stats ?? {}).reduce((acc, cur) => {
    acc[cur] = {
      label: cur,
      color: getRandomColor(cur)
    };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);





  return (
    <MainLayout>
      <main className={styles.container}>
        <h1 className={styles.title}>Unusual deals filtering</h1>

        <div className={cn(styles.chart, styles.grid_item)}>
          <h3>Deals chart</h3>
          <span className={"text-muted-foreground ml-1"}>Deals filtered by default presets.</span>
          <ChartContainer config={chartConfig} className={"w-full flex grow"}>
            <AreaChart data={chartData} margin={{left: 12, right: 12}}>
              <CartesianGrid vertical={false} horizontal={false}/>
              <XAxis tickLine={false} axisLine={false} tickMargin={8}
                     tickFormatter={(value) => value.slice(0, 3)} dataKey="day"/>
              <ChartTooltip cursor={false} content={(props) => (
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                <ChartTooltipContent {...props} indicator="line" />
              )}/>
              {Object.keys(chartData[0]?.stats ?? {}).map((key) => (
                <Area
                  key={key}
                  dataKey={`stats.${key}`}
                  name={key}
                  type="natural"
                  fill={chartConfig[key].color}
                  stroke={chartConfig[key].color}
                  fillOpacity={0.25}
                  stackId={key}
                />
              ))}
              {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
              {// @ts-expect-error
              <Legend content={(props) => <ChartLegendContent {...props} />} verticalAlign="bottom" />
              }
            </AreaChart>
          </ChartContainer>
        </div>

        <div className={cn(styles.currencies, styles.grid_item)}>
          <h3>Filter</h3>

          <Accordion type={"single"} collapsible>
            <AccordionItem value={"item-1"}>
              <AccordionTrigger><h5>Presets</h5></AccordionTrigger>
              <AccordionContent className={styles.preset_flexbox}>
                {presets.map((item) =>
                  <Badge key={item.id} onClick={() => handlePresetClick(item)}
                         className={cn(item.isDefault ? "bg-blue-500" : "", styles.preset_badge, "hover:bg-green-600")}>
                    {item.name}
                  </Badge>)}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className={formStyles.input_block}>
            <label>Date</label>
            <DatePickerWithRange defaultDateRange={dateRange} onDateChange={setDateRange} className={"w-full"}/>
          </div>

          <FilterBuilder
            currencies={currencies}
            descriptions={descriptions}
            value={filterState}
            onChange={handleFilterChange}
          />

          <Button onClick={handleSearch}>Search</Button>
        </div>

        <div className={cn(styles.default_filters, "flex flex-col gap-4", styles.grid_item)}>
          <h3>Default filters</h3>
          <div className={"flex gap-4"}>
            <Button variant={"secondary"} onClick={()=>downloadTradesCsv(tableData)}>Save to csv</Button>
          </div>
          <TradesTable trades={tableData}/>
        </div>
      </main>
    </MainLayout>
  );
}


export const getServerSideProps = (async (context) => {
  const conf = getConfig();

  const cookie = context.req.cookies;

  const token= cookie["token"];
  let presets: IPreset[] = [];

  try {
    if (token) {
      const { payload } = decodeJwt(token);

      if (payload?.role === "Admin") {
        const presetRes = await fetch(`${conf.publicRuntimeConfig.backendUrl}/preset/all`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include"
        });
        presets = await presetRes.json() as IPreset[];
        console.log(presetRes.statusText);
      } else {
        const [publicRes, myRes] = await Promise.all([
          fetch(`${conf.publicRuntimeConfig.backendUrl}/preset/public`, {
            headers: { Authorization: `Bearer ${token}` },
            credentials: "include"
          }),
          fetch(`${conf.publicRuntimeConfig.backendUrl}/preset/my`, {
            headers: { Authorization: `Bearer ${token}` },
            credentials: "include"
          }),
        ]);

        const publicPresets = await publicRes.json() as IPreset[];
        const myPresets = await myRes.json() as IPreset[];


        const mergedMap = new Map<number, IPreset>();
        [...publicPresets, ...myPresets].forEach(p => mergedMap.set(p.id, p));
        presets = Array.from(mergedMap.values());
      }
    } else {
      const presetRes = await fetch(`${conf.publicRuntimeConfig.backendUrl}/preset/public`);
      presets = await presetRes.json() as IPreset[];
    }
  }
  catch (error) {
    console.error(error);
  }

  const recentRes = await fetch(`${conf.publicRuntimeConfig.backendUrl}/filter/stats_by_currency`);
  const recentDeals = await recentRes.json() as DealsStatsByCurrencyDto[];

  const currRes = await fetch(`${conf.publicRuntimeConfig.backendUrl}/currency/all`);
  const currencies = await currRes.json() as ICurrency[];

  const descRes = await fetch(`${conf.publicRuntimeConfig.backendUrl}/descriptions`);
  const descriptions = await descRes.json() as IFilterDescription[];

  return {
    props: {
      presets,
      currencies,
      descriptions,
      recentDeals,
    }
  };
}) satisfies GetServerSideProps<{
  presets : IPreset[];
  currencies: ICurrency[];
  descriptions: IFilterDescription[],
  recentDeals: DealsStatsByCurrencyDto[];
}>;
