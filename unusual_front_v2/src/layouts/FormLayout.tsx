import styles from "./Layout.module.scss";
import {cn} from "@/lib/utils";
import {ToastContainer} from "react-toastify";

export interface FormLayoutProps {
  children?: React.ReactNode,
  center?: "vertical" | "horizontal" | "full",
}

export default function FormLayout({children, center = "full"}: FormLayoutProps) {
  let centerStyle :string;
  switch (center) {
    case "vertical":
      centerStyle = styles.center_items_vertical;
      break;
    case "horizontal":
      centerStyle = styles.center_items_horizontal;
      break;
    default:
      centerStyle = styles.center_items;
      break;
  }

  return (
    <div className={cn(styles.wrapper, centerStyle)}>
      <ToastContainer/>
      {children}
    </div>
  );
}