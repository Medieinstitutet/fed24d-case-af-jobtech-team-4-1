import { createBrowserRouter } from "react-router";
import { About } from "./pages/About";
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
        path: "/:occupationSlug/:id",
        element: <SingleAd />,
      },
      {
        path: "/:occupationSlug",
        element: <Occupation />,
      },
    ],
    errorElement: <Error />,
  },
],
  {
    basename: "/fed24d-case-af-jobtech-team-4-1/", 
  }
);
