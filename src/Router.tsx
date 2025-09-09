import { createBrowserRouter } from "react-router";
import { About } from "./pages/About";
import { AllAds } from "./pages/AllAds";
import { Backend } from "./pages/Backend";
import { Frontend } from "./pages/Frontend";
import { Fullstack } from "./pages/Fullstack";
import { Layout } from "./pages/Layout";
import { Start } from "./pages/Start";
import { Error } from "./pages/Error";
import { SingleAd } from "./pages/SingleAd";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Start />,
      },
      {
        path: "/om-oss",
        element: <About />,
      },
      {
        path: "/backend",
        element: <Backend />,
      },
      {
        path: "/frontend",
        element: <Frontend />,
      },
      {
        path: "/fullstack",
        element: <Fullstack />,
      },
      {
        path: "/all-ads",
        element: <AllAds />,
      },
      {
        path: "/:id",
        element: <SingleAd />,
      },
    ],
    errorElement: <Error />,
  },
]);
