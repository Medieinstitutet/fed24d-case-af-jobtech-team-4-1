import { Outlet } from "react-router";
import { Footer } from "../components/Footer";
import { DigiLayoutBlock, DigiTypography } from "@digi/arbetsformedlingen-react";
import { LayoutBlockVariation } from "@digi/arbetsformedlingen";
import { Navigation } from "../components/Navigation";
import { JobContext } from "../contexts/JobContext";
import { useReducer } from "react";
import { JobReducer } from "../reducers/JobReducer";
import { initialState } from "../contexts/JobContext";

export const Layout = () => {
  const [jobs, dispatch] = useReducer(JobReducer, initialState);

  return (
    <JobContext.Provider value={{ jobs, dispatch }}>
      <DigiLayoutBlock afVariation={LayoutBlockVariation.PRIMARY} className="page-shell">
        <DigiTypography>
          {/* flex layout */}
          <div className="page">
            <header className="site-header">
              <Navigation />
            </header>

            <main id="main" className="page-main">
              <Outlet />
            </main>

            <Footer />
          </div>
        </DigiTypography>
      </DigiLayoutBlock>
    </JobContext.Provider>
  );
};

export default Layout;
