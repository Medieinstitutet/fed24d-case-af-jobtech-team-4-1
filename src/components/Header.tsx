import { DigiHeader, DigiLayoutContainer } from "@digi/arbetsformedlingen-react";
import { Navigation } from "./Navigation";
import "./Header.scss";

export const Header = () => {
  return (
    <>
      <DigiLayoutContainer className="header-margin my-header">
        <DigiHeader afSystemName="Kodbanken" afHideSystemName={true} afMenuButtonText="Meny" className="menu-text">
          <a slot="header-logo" aria-label="Tillbaka till start" href={import.meta.env.BASE_URL}>
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Min logga" className="logo-img" width="300" height="120" />
          </a>
        </DigiHeader>
        <Navigation />
      </DigiLayoutContainer>
    </>
  );
};
