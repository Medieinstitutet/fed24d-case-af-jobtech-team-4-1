import { Outlet } from "react-router";
import { Footer } from "../components/Footer";
import { DigiLayoutBlock } from "@digi/arbetsformedlingen-react";
import { LayoutBlockVariation } from "@digi/arbetsformedlingen";

export const Layout = () => {
  return (
    <DigiLayoutBlock afVariation={LayoutBlockVariation.PRIMARY}>
      <header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </DigiLayoutBlock>
  );
};
