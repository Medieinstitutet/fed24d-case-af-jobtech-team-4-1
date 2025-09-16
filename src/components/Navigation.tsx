import { DigiHeaderNavigation, DigiHeaderNavigationItem } from "@digi/arbetsformedlingen-react";
// import "../index.scss";
import { useLocation } from "react-router";
import "./Navigation.scss";

export const Navigation = () => {
  const whichPage = useLocation();
  return (
    <>
      <DigiHeaderNavigation afCloseButtonText="Stäng" afCloseButtonAriaLabel="Stäng meny" afNavAriaLabel="Huvudmeny">
        <div className="nav-links">
          <DigiHeaderNavigationItem afCurrentPage={whichPage.pathname === "/"}>
            <a href="/">Hem</a>
          </DigiHeaderNavigationItem>
          <DigiHeaderNavigationItem afCurrentPage={whichPage.pathname === "/om-oss"}>
            <a href="/om-oss">Om oss</a>
          </DigiHeaderNavigationItem>
        </div>
      </DigiHeaderNavigation>
    </>
  );
};
