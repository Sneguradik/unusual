
import {DateRange} from "react-day-picker";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {HTMLAttributes, useEffect, useState} from "react"
import { format } from "date-fns"
import {CalendarIcon} from "lucide-react";

export interface DatePickerWithRangeProps extends HTMLAttributes<HTMLDivElement> {
  defaultDateRange?: DateRange
  onDateChange?: (dateRange: DateRange) => void
}

export default function DatePickerWithRange({className, onDateChange, defaultDateRange}: DatePickerWithRangeProps) {
  const initialDate = new Date();
  initialDate.setDate(initialDate.getDate() - 2);

  const [date, setDate] = useState<DateRange | undefined>(defaultDateRange?defaultDateRange:{
    from: initialDate,
    to: new Date(),
  })

  useEffect(() => {
    if (onDateChange && date) onDateChange(date)
  }, [date, onDateChange]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "min-w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
