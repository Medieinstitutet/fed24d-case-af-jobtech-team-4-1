import { useParams } from "react-router";
import { AdsPresentation } from "../components/AdsPresentation";
import type { OccupationId } from "../services/jobAdService";
import SearchFiltersDigi from "../components/SearchFiltersDigi";

export const Occupation = () => {
  const { occupation } = useParams();
  const occ = (occupation as OccupationId) ?? ("group=2512" as OccupationId);

  return (
    <>
      <SearchFiltersDigi occupation={occ} />
      <AdsPresentation occupation={occ}></AdsPresentation>
    </>
  );
};
