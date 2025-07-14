import styles from "./Layout.module.scss";
import {cn} from "@/lib/utils";
import Header from "@components/Header";
import AuthComponent from "@components/AuthComponent";
import {ToastContainer} from "react-toastify";

export default function MainLayout({children}: {children?: React.ReactNode}) {
  return (
    <div className={cn(styles.wrapper, styles.center_items_vertical)}>
      <AuthComponent/>
      <Header />
      <ToastContainer/>
      <div className={cn(styles.content, styles.center_items_vertical)}>
        {children}
      </div>
    </div>
  )
}