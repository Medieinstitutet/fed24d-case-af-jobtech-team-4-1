import { useParams } from "react-router";
import { AdsPresentation } from "../components/AdsPresentation";
import { DigiTypographyPreamble } from "@digi/arbetsformedlingen-react";
import { slugToOccupation } from "../utils/occupationUtils";

export const Occupation = () => {
  const { occupationSlug } = useParams<{ occupationSlug?: string }>();

  if (!occupationSlug || !(occupationSlug in slugToOccupation)) {
  return <p>Ogiltig kategori</p>;
  }

  const occupation = slugToOccupation[occupationSlug];

  return (
    <>
      <DigiTypographyPreamble>Här hittar du alla annonser inom {occupationSlug}.</DigiTypographyPreamble>
      <AdsPresentation occupation={occupation}></AdsPresentation>
    </>
  );
};
