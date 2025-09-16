import { DigiLayoutBlock, DigiTypography } from "@digi/arbetsformedlingen-react";
import { LayoutBlockVariation } from "@digi/arbetsformedlingen";
import "./About.scss";

export const About = () => {
  return (
    <>
      <DigiLayoutBlock afVariation={LayoutBlockVariation.PRIMARY} className="about-block">
        <DigiTypography>
          <h2>Om oss</h2>
          <p>
            Kodbanken - Branch Out är platsbanken för utvecklare, skapad av utvecklare. Vi vet att det kan vara svårt
            att hitta rätt jobb i en djungel av annonser som inte alltid är anpassade för tech. Därför byggde vi en
            plattform där du som utvecklare enkelt kan navigera utifrån din stack - oavsett om du är frontend-hacker,
            backend-guru eller fullstack-ninja.
          </p>
          <h3>Hos oss kan du:</h3>
          <ul>
            <li>- Filtrera jobb baserat på din techstack.</li>
            <li>- Hitta annonser nära dig med hjälp av geolocation.</li>
            <li>- Upptäcka nya möjligheter och branch out i karriären.</li>
          </ul>
          <p>
            Vi tror på enkelhet, transparens och kodglädje. Vårt mål är att göra jobbsökandet lite mer som att pusha en
            commit - snabbt, tydligt och med rätt branch i sikte.
          </p>
        </DigiTypography>
      </DigiLayoutBlock>
    </>
  );
};
