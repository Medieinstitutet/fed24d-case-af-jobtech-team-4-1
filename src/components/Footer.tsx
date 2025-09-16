import { FooterVariation } from "@digi/arbetsformedlingen";
import { DigiFooter } from "@digi/arbetsformedlingen-react";
import "./Footer.scss";

export const Footer = () => {

  return (
    <DigiFooter afVariation={FooterVariation.SMALL} className="site-footer">
      <div className="site-footer__content">
        <p>© 2025 Kodbanken - Branch Out</p>
      </div>
    </DigiFooter>
  ) 
};
