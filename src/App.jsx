import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home/Home";
import Layout from "./components/Layout/Layout";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import NotFound from "./components/NotFound/NotFound";
import { Toaster } from "react-hot-toast";
import CounterContextProvider from "./components/Context/CounterContext";
import { HeroUIProvider } from "@heroui/react";
import Profile from "./components/Profile/Profile";
import AuthContextProvider from "./components/Context/AuthContext";
import ProtectedLogin from "./components/ProtectedLogin/ProtectedLogin";
import ProtectedLogout from "./components/ProtectedLogout/ProtectedLogout";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import PostDetails from "./components/PostDetails/PostDetails";
import { useNetworkState } from "react-use";
import DetectOffline from "./components/DetectOffline/DetectOffline";
import Auth from "./components/Auth/Auth";
import UserProfile from "./components/UserProfile/UserProfile";
import ChangePassword from "./components/ChangePassword/ChangePassword";

const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedLogin>
            <Home />
          </ProtectedLogin>
        ),
      },
      {
        path: "home",
        element: (
          <ProtectedLogin>
            <Home />
          </ProtectedLogin>
        ),
      },
      {
        path: "postdetails/:id",
        element: (
          <ProtectedLogin>
            <PostDetails />
          </ProtectedLogin>
        ),
      },
      {
        path: "profile/:userId",
        element: (
          <ProtectedLogin>
            <UserProfile />
          </ProtectedLogin>
        ),
      },
      {
        path: "changepassword",
        element: (
          <ProtectedLogin>
            <ChangePassword />
          </ProtectedLogin>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedLogin>
            <Profile />
          </ProtectedLogin>
        ),
      },

      {
        path: "auth",
        element: (
          <ProtectedLogout>
            <Auth />
          </ProtectedLogout>
        ),
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

const query = new QueryClient();

function App() {
  const { online } = useNetworkState();

  return (
    <>
      {!online && <DetectOffline />}
      <QueryClientProvider client={query}>
        <AuthContextProvider>
          <HeroUIProvider>
            <CounterContextProvider>
              <Toaster containerStyle={{ zIndex: 9999 }} />
              <RouterProvider router={router}></RouterProvider>
            </CounterContextProvider>
          </HeroUIProvider>
        </AuthContextProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
