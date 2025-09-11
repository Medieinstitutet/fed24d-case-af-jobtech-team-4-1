import { DigiHeaderNavigation, DigiHeaderNavigationItem } from "@digi/arbetsformedlingen-react";
import "../index.scss";
import { useLocation } from "react-router";

export const Navigation = () => {
  const whichPage = useLocation();
  return (
    <>
      <DigiHeaderNavigation afCloseButtonText="Stäng" afCloseButtonAriaLabel="Stäng meny" afNavAriaLabel="Huvudmeny">
        <a href="/" className="nav-logo">
          <img src="/logo.png" alt="Min logga" className="logo-img" />
        </a>
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
