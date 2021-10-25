import MainNavigation from "./MainNavigation";
import classes from "./Layout.module.css";
import { SnackbarProvider } from "notistack";

function Layout(props) {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <div>
        <MainNavigation />
        <main className={classes.main}>{props.children}</main>
      </div>
    </SnackbarProvider>
  );
}

export default Layout;
