import { useParams } from "react-router";
import { AdsPresentation } from "../components/AdsPresentation";
import type { OccupationId } from "../services/jobAdService";

export const Occupation = () => {
  const { occupation } = useParams();
  const occ = occupation as OccupationId;

  return (
  <>
    <AdsPresentation occupation={occ}></AdsPresentation>
  </>
  )
};
