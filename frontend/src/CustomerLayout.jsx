import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const CustomerLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

export default CustomerLayout;