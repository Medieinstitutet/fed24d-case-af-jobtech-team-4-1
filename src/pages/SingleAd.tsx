import { useEffect, useState } from "react";
import { useParams } from "react-router";
import type { IAd } from "../models/IAd";
import { getJobAds, OccupationId } from "../services/jobAdService";
import { DigiLayoutBlock, DigiTypography } from "@digi/arbetsformedlingen-react";
import { LayoutBlockVariation } from "@digi/arbetsformedlingen";

export const SingleAd = () => {
  const {id} = useParams(); 

  const [ad, setAd] = useState<IAd | undefined>(undefined);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const allAds = await getJobAds(OccupationId.BACKEND);
        const found = allAds.find((a) => a.id === id);
        setAd(found);
      } catch (error) {
        console.error("Fel vid hämtningen", error);
      } finally {
        setLoading(false); 
      }
    };
    fetchAd();
  },[id]);

  if(loading) return <p>Laddar...</p>;
  if(!ad) return <p>Annonsen hittades inte.</p>;

  return ( 
  <>
  <DigiLayoutBlock afVariation={LayoutBlockVariation.PRIMARY}> 
    <DigiTypography>
      <h1>{ad.headline}</h1>
      <p>{ad.employer.name}</p>

    </DigiTypography>
  </DigiLayoutBlock>
  </>);
};

