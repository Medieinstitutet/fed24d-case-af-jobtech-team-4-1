import { useEffect, useState } from "react";
import { useParams } from "react-router";
import type { IAd } from "../models/IAd";
import { getJobAds, OccupationId } from "../services/jobAdService";
import { DigiLayoutBlock, DigiLayoutContainer, DigiLinkButton, DigiTypography } from "@digi/arbetsformedlingen-react";
import { LayoutBlockVariation, LinkButtonSize, LinkButtonVariation } from "@digi/arbetsformedlingen";

export const SingleAd = () => {
  const { id } = useParams();

  const [ad, setAd] = useState<IAd | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const allAds = await getJobAds(OccupationId.BACKEND);
        const found = allAds.find(a => a.id === id);
        setAd(found);
      } catch (error) {
        console.error("Fel vid hämtningen", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAd();
  }, [id]);

  if (loading) return <p>Laddar...</p>;
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
