import {ICurrency, IFilter, IFilterDescription, IFilterMessage} from "@logic/Entities";
import {cn} from "@/lib/utils";
import formStyles from "@styles/FormStyles.module.scss";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@components/ui/select";
import {Textarea} from "@components/ui/textarea";
import Filter from "@components/Filter";


export interface IFilterBuilderProps {
  value: IFilterMessage;
  onChange: (val: IFilterMessage) => void;
  currencies: ICurrency[];
  descriptions: IFilterDescription[];
}

export default function FilterBuilder({currencies, onChange, value}: IFilterBuilderProps) {
  const handleCurrencyChange = (val: string) => {
    const selected = currencies.find(c => c.id.toString() === val);
    if (selected) {
      onChange({ ...value, currency: selected });
    }
  };

  const handleExcludedCodesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ ...value, excludedCodes: e.target.value });
  };

  const handleFilterChange = (updated: IFilter) => {
    const updatedFilters = value.filters.map(f =>
      f.description.id === updated.description.id ? updated : f
    );
    onChange({ ...value, filters: updatedFilters });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className={cn(formStyles.input_block)}>
        <label htmlFor="currency">Currency</label>
        <Select
          name="currency"
          value={value.currency?.id?.toString()}
          onValueChange={handleCurrencyChange}
        >
          <SelectTrigger className="w-full bg-background hover:bg-accent hover:text-accent-foreground">
            <SelectValue placeholder="Currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {currencies.map((cur) => (
                <SelectItem key={cur.id} value={cur.id.toString()}>
                  {cur.symbol}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className={cn(formStyles.input_block)}>
        <label htmlFor="excludedCodes">Excluded Codes</label>
        <Textarea
          placeholder="Excluded codes..."
          value={value.excludedCodes}
          onChange={handleExcludedCodesChange}
        />
        <p className="text-sm text-muted-foreground">Write excluded codes separated by &quot;, &quot;</p>
      </div>

      <div className={cn(formStyles.input_block)}>
        <label htmlFor="filters">Filters</label>
        <div className="flex flex-col gap-4 max-h-[25rem] overflow-y-auto border-2 p-4 rounded-md">
          {value.filters.map((filter) => (
            <Filter
              key={filter.description.id}
              filter={filter}
              onFilterChange={handleFilterChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
