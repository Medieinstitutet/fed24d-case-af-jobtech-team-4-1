import { LayoutBlockVariation, LayoutColumnsElement, LayoutColumnsVariation, LinkButtonSize, LinkButtonVariation } from "@digi/arbetsformedlingen";
import { DigiLayoutBlock, DigiLayoutColumns, DigiLayoutContainer, DigiLinkButton } from "@digi/arbetsformedlingen-react"

export const Start = () => {
  return (
  <>
  <DigiLayoutBlock afVariation={LayoutBlockVariation.PRIMARY}>
    <DigiLayoutContainer>
        <h2>Hem</h2>
        <h3>Välkommen till Kodbanken - Branch Out</h3>
        <p>Här hittar du jobbannonser för utvecklare, sorterat efter din stack. </p>
        <p>Dags att committa till nästa steg i karriären? </p>
        <p>Välj ditt spår och pusha din framtid framåt.</p>
    </DigiLayoutContainer>

    <DigiLayoutColumns afElement={LayoutColumnsElement.DIV} afVariation={LayoutColumnsVariation.TWO}>
      <DigiLinkButton afHref="/frontend" afSize={LinkButtonSize.LARGE} afVariation={LinkButtonVariation.PRIMARY}>
        Frontend
      </DigiLinkButton>
      <DigiLinkButton afHref="/backend" afSize={LinkButtonSize.LARGE} afVariation={LinkButtonVariation.PRIMARY}>
        Backend
      </DigiLinkButton>
      <DigiLinkButton afHref="/fullstack" afSize={LinkButtonSize.LARGE} afVariation={LinkButtonVariation.PRIMARY}>
        Fullstack
      </DigiLinkButton>
      <DigiLinkButton afHref="/all-ads" afSize={LinkButtonSize.LARGE} afVariation={LinkButtonVariation.PRIMARY}>
        Alla annonser
      </DigiLinkButton>
    </DigiLayoutColumns>
  </DigiLayoutBlock>
  </>);
};
