import React from "react";
import { Navigate } from "react-router-dom";
import MyNavbar from "../Navbar/Navbar";

export default function ProtectedLogin({ children }) {
  if (localStorage.getItem("userToken")) {
    return (
      <>
        <MyNavbar />
        {children}
      </>
    );
  } else {
    return <Navigate to="/auth" />;
  }

  return <div>ProtectedLogin</div>;
}
