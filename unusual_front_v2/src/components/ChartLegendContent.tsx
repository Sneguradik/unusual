import React from "react";

interface LegendProps {
  payload?: {
    value: string;
    color: string;
    type: string;
  }[];
}

export default function ChartLegendContent({ payload }: LegendProps) {
  if (!payload || payload.length === 0) return null;

  return (
    <div className="flex gap-4 justify-center mt-2 flex-wrap">
      {payload.map((entry, index) => (
        <div key={`legend-item-${index}`} className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
          <span className="text-muted-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}
