
import { unparse } from "papaparse";
import {ITradeStatAnalyzed} from "@logic/Entities";

export function downloadTradesCsv(trades: ITradeStatAnalyzed[]) {

  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  const fileName = `trades_${randomSuffix}.csv`;

  const csv = unparse(trades, {
    quotes: true,
    skipEmptyLines: true,
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
