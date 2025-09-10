import { FooterVariation } from "@digi/arbetsformedlingen";
import { DigiFooter } from "@digi/arbetsformedlingen-react";
import "./Footer.css";

export const Footer = () => {
  return (
    <>
      <DigiFooter afVariation={FooterVariation.SMALL}>
        <div slot="content-bottom-right">
          <p>© 2025 Kodbanken - Branch Out</p>
        </div>
      </DigiFooter>
    </>
  );
};
