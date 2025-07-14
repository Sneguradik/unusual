import {Switch} from "@components/ui/switch";
import {Key} from "react";
import styles from "./Filter.module.scss";
import {RadioGroup, RadioGroupItem} from "@components/ui/radio-group";
import {FaEquals, FaGreaterThan, FaGreaterThanEqual, FaLessThan, FaLessThanEqual, FaNotEqual} from "react-icons/fa6";
import {Checkbox} from "@components/ui/checkbox";
import {Input} from "@components/ui/input";
import {IFilterCondition, IFilter, IFilterType} from "@logic/Entities";


export interface IFilterProps {
  filter: IFilter
  onFilterChange?: (filter: IFilter) => void
  key?: Key
}

export default function Filter({ filter, onFilterChange, key }: IFilterProps) {
  const update = (patch: Partial<IFilter>) => {
    if (onFilterChange) {
      onFilterChange({ ...filter, ...patch });
    }
  };

  return (
    <div className="flex w-full flex-col gap-4 p-4 rounded-md bg-secondary transition-all" key={key}>
      <div className="flex justify-between items-center">
        <div>
          <h6>{filter.description.name}</h6>
        </div>
        <Switch
          checked={filter.active}
          onCheckedChange={() => update({ active: !filter.active })}
        />
      </div>
      <p className="text-muted-foreground">{filter.description.description}</p>

      <div className={styles.filter_control}>
        <small>Условие</small>
        <RadioGroup
          className={styles.filter_control_radio}
          value={filter.condition.toString()}
          onValueChange={(val) => update({ condition: parseInt(val) })}
        >
          <div className={styles.filter_control_radio_item}>
            <RadioGroupItem value={IFilterCondition.Equals.toString()} />
            <FaEquals />
          </div>
          <div className={styles.filter_control_radio_item}>
            <RadioGroupItem value={IFilterCondition.Less.toString()} />
            <FaLessThan />
          </div>
          <div className={styles.filter_control_radio_item}>
            <RadioGroupItem value={IFilterCondition.Greater.toString()} />
            <FaGreaterThan />
          </div>
          <div className={styles.filter_control_radio_item}>
            <RadioGroupItem value={IFilterCondition.LessOrEquals.toString()} />
            <FaLessThanEqual />
          </div>
          <div className={styles.filter_control_radio_item}>
            <RadioGroupItem value={IFilterCondition.GreaterOrEquals.toString()} />
            <FaGreaterThanEqual />
          </div>
          <div className={styles.filter_control_radio_item}>
            <RadioGroupItem value={IFilterCondition.NotEquals.toString()} />
            <FaNotEqual />
          </div>
        </RadioGroup>
      </div>

      <Input
        placeholder="Value"
        type="number"
        value={filter.value}
        onChange={(e) => update({ value: parseFloat(e.target.value) })}
      />

      <hr className="border-1" />

      <div className="grid gap-2 grid-cols-2">
        <div className={styles.filter_control}>
          <small>Тип фильтра</small>
          <RadioGroup
            className="grid grid-cols-2"
            value={filter.type.toString()}
            onValueChange={(val) => update({ type: parseInt(val) })}
          >
            <div className={styles.filter_control_radio_item}>
              <RadioGroupItem value={IFilterType.And.toString()} />
              <span>And</span>
            </div>
            <div className={styles.filter_control_radio_item}>
              <RadioGroupItem value={IFilterType.Or.toString()} />
              <span>Or</span>
            </div>
          </RadioGroup>
        </div>

        <div className={styles.filter_control}>
          <small>Триггер</small>
          <div className={styles.filter_control_radio_item}>
            <Checkbox
              checked={filter.useTrigger}
              onCheckedChange={(e) => update({ useTrigger: e === true })}
            />
            <span>Use</span>
          </div>
        </div>
      </div>
    </div>
  );
}