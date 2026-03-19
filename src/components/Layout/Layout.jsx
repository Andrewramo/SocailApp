import React from "react";

import { Outlet } from "react-router-dom";
import Footer from "./../Footer/Footer";
import MyNavbar from "./../Navbar/Navbar";

export default function Layout() {
  return (
    <>
      <Outlet />
    </>
  );
}
