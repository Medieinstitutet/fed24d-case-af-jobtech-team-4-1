import { AdsPresentation } from "../components/AdsPresentation";
import { OccupationId } from "../services/jobAdService";

export const Backend = () => {
  return (
    <>
      <AdsPresentation occupation={OccupationId.BACKEND} />
    </>
  );
};
