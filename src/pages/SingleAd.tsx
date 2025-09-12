import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import type { IAd } from "../models/IAd";
import { getJobAds, OccupationId } from "../services/jobAdService";
import { DigiLayoutBlock, DigiLayoutContainer, DigiLinkButton, DigiLoaderSpinner, DigiTypography } from "@digi/arbetsformedlingen-react";
import { LayoutBlockVariation, LinkButtonSize, LinkButtonVariation, LoaderSpinnerSize } from "@digi/arbetsformedlingen";
import { JobActionTypes } from "../reducers/JobReducer";
import { JobContext } from "../contexts/JobContext";

const findAd = (ads: IAd[], id?: string) => {
  if (!id) return undefined;
  return ads.find(a => a.id === id);
};

const getAdFromContext = (jobs: Record<OccupationId, IAd[]>, occ: OccupationId, id?: string) => {
  return findAd(jobs[occ], id);
};

export const SingleAd = () => {
  const { id, occupation } = useParams();
  const occ = occupation as OccupationId;
  const { jobs, dispatch } = useContext(JobContext);

  const [ad, setAd] = useState<IAd | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !occ) return;

    const found = getAdFromContext(jobs, occ, id);
    if (found) {
      setAd(found);
      setLoading(false);
      return;
    }

    const fetchAd = async () => {
      try {
        const allAds = await getJobAds(occ);
        dispatch({
          type: JobActionTypes.SET_JOBS,
          payload: { occupation: occ, jobs: allAds },
        });
        setAd(findAd(allAds, id));
      } catch (error) {
        console.error("Fel vid hämtningen", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAd();
  }, [id, occ, jobs, dispatch]);

  if (loading) return <DigiLoaderSpinner afSize={LoaderSpinnerSize.MEDIUM} afText="Laddar"></DigiLoaderSpinner>;
  if (!ad) return <p>Annonsen hittades inte.</p>;

  const deadline = new Date(ad.application_deadline);
  const formattedDate = new Intl.DateTimeFormat("sv-SE", {
    day: "numeric",
    month: "long",
  }).format(deadline);
  const today = new Date();
  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <>
      <DigiLayoutBlock afVariation={LayoutBlockVariation.PRIMARY}>
        <DigiTypography className="single-ad-text">
          <h1>{ad.headline}</h1>
          <h2>{ad.employer.name}</h2>
          <h3>Om jobbet:</h3>
          <p>Kategori:{ad.occupation.label}</p>
          <p>Omfattning:{ad.working_hours_type.label}</p>
          <p style={{ whiteSpace: "pre-line" }}>{ad.description.text}</p>
          <DigiLayoutContainer>
            <h3>Sök jobbet:</h3>
            <p>
              Ansök senast <strong>{formattedDate}</strong> {diffDays > 0 && <span>(om {diffDays} dagar)</span>}
            </p>
            <DigiLinkButton
              afHref="#"
              afSize={LinkButtonSize.MEDIUM}
              afVariation={LinkButtonVariation.PRIMARY}
              af-hide-icon={true}
            >
              Commit ansökan 😉
            </DigiLinkButton>
          </DigiLayoutContainer>
        </DigiTypography>
      </DigiLayoutBlock>
    </>
  );
};
