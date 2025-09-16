import { Outlet } from "react-router";
import { Footer } from "../components/Footer";
import { DigiLayoutBlock, DigiTypography } from "@digi/arbetsformedlingen-react";
import { LayoutBlockVariation } from "@digi/arbetsformedlingen";
import { JobContext } from "../contexts/JobContext";
import { useReducer } from "react";
import { JobReducer } from "../reducers/JobReducer";
import { initialState } from "../contexts/JobContext";
import { Header } from "../components/Header";

export const Layout = () => {
  const [jobs, dispatch] = useReducer(JobReducer, initialState);

  return (
    <JobContext.Provider value={{ jobs, dispatch }}>
      <DigiLayoutBlock afVariation={LayoutBlockVariation.PRIMARY} className="page-shell">
        <DigiTypography>
          <div className="page">
            <Header/>
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
