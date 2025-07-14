import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@components/ui/table";
import styles from "./TradesTable.module.scss";
import {MdAccountBalance, MdAccountCircle, MdDateRange} from "react-icons/md";
import {FaDollarSign} from "react-icons/fa6";
import {TbClockDown, TbClockUp} from "react-icons/tb";
import {IoWarning} from "react-icons/io5";
import {ITradeStatAnalyzed} from "@logic/Entities";
import {cn} from "@/lib/utils";

import {LuBadge} from "react-icons/lu";
export interface ITradesTableProps {
  trades: ITradeStatAnalyzed[];
}
export default function TradesTable({trades}: ITradesTableProps) {
  return (
    <Table className={styles.scrollbar}>
      <TableHeader className={styles.scrollbar}>
        <TableRow className={cn(styles.table_header,styles.scrollbar)}>
          <TableHead><div className={styles.head_item}><MdDateRange/>Trade day</div></TableHead>
          <TableHead><div className={styles.head_item}><LuBadge />Ticker</div></TableHead>
          <TableHead><div className={styles.head_item}><FaDollarSign/>Currency</div></TableHead>
          <TableHead><div className={styles.head_item}><MdAccountCircle/>Account</div></TableHead>
          <TableHead><div className={styles.head_item}><MdAccountBalance/>Client code</div></TableHead>
          <TableHead><div className={styles.head_item}><TbClockDown/>Min deal time</div></TableHead>
          <TableHead><div className={styles.head_item}><TbClockUp/>Max deal time</div></TableHead>
          <TableHead className={styles.trigger_cell}><div className={styles.head_item}><IoWarning />Total triggers</div></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className={styles.scrollbar}>
        {trades.map((value, index) => {
          return (
          <TableRow key={index}>
            <TableCell>{value.tradeDate}</TableCell>
            <TableCell>{value.assetCode}</TableCell>
            <TableCell>{value.currency}</TableCell>
            <TableCell>{value.account}</TableCell>
            <TableCell>{value.clientCode}</TableCell>
            <TableCell>{value.minDealTime}</TableCell>
            <TableCell>{value.maxDealTime}</TableCell>
            <TableCell className={styles.trigger_cell}>{value.totalScore}</TableCell>
          </TableRow>)
        })}


      </TableBody>
    </Table>
  )
}