import { createBrowserRouter } from "react-router";
import { About } from "./pages/About";
import { Backend } from "./pages/Backend";
import { Occupation } from "./pages/Occupation";
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
        path: "/:occupation",
        element: <Occupation />,
      },
      {
        path: "/:id",
        element: <SingleAd />,
      },
    ],
    errorElement: <Error />,
  },
]);
