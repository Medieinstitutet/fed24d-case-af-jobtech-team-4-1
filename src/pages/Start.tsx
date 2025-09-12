import {
  LayoutBlockVariation,
  LayoutColumnsElement,
  LayoutColumnsVariation,
  LinkButtonSize,
  LinkButtonVariation,
} from "@digi/arbetsformedlingen";
import {
  DigiLayoutBlock,
  DigiLayoutColumns,
  DigiLayoutContainer,
  DigiLinkButton,
} from "@digi/arbetsformedlingen-react";
import { OccupationId } from "../services/jobAdService";
import "./Start.scss";

export const Start = () => {
  return (
    <>
      <DigiLayoutBlock afVariation={LayoutBlockVariation.PRIMARY} className="home-block">
        <h1>Hem</h1>
        <DigiLayoutContainer className="home-text">
          <h2>Välkommen till Kodbanken - Branch Out</h2>
          <p>Här hittar du jobbannonser för utvecklare, sorterat efter din stack. </p>
          <p>Dags att committa till nästa steg i karriären? </p>
          <p>Välj ditt spår och pusha din framtid framåt.</p>
        </DigiLayoutContainer>

        <DigiLayoutColumns afElement={LayoutColumnsElement.DIV} afVariation={LayoutColumnsVariation.TWO}>
          <DigiLinkButton
            afHref={`/${OccupationId.FRONTEND}`}
            afSize={LinkButtonSize.LARGE}
            afVariation={LinkButtonVariation.PRIMARY}
          >
            Frontend
          </DigiLinkButton>
          <DigiLinkButton
            afHref={`/${OccupationId.BACKEND}`}
            afSize={LinkButtonSize.LARGE}
            afVariation={LinkButtonVariation.PRIMARY}
          >
            Backend
          </DigiLinkButton>
          <DigiLinkButton
            afHref={`/${OccupationId.FULLSTACK}`}
            afSize={LinkButtonSize.LARGE}
            afVariation={LinkButtonVariation.PRIMARY}
          >
            Fullstack
          </DigiLinkButton>
          <DigiLinkButton
            afHref={`/${OccupationId.ALL}`}
            afSize={LinkButtonSize.LARGE}
            afVariation={LinkButtonVariation.PRIMARY}
          >
            Alla annonser
          </DigiLinkButton>
        </DigiLayoutColumns>
      </DigiLayoutBlock>
    </>
  );
};
