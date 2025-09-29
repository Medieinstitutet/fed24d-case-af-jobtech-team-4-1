# 📌 Rättningsrapport – fed24d-case-af-jobtech-team-4-1

## 🎯 Uppgiftens Krav:
[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/6VsM7MHT)
# Skapa en egen Platsbanken för ert drömscenario 

Dokumentation om Arbetsförmedlingens öppna data finns på https://jobtechdev.se. All öppna data från arbetsförmedlingen och andra offentliga organisationen går även att hitta direkt på dataportal.se. 
I detta dokument ges två förslag på användningsfall som vi tror är lämpliga för studenter som vill utveckla en applikation på riktig data. All data som är öppna data får vem som helst använda utan att fråga myndigheten om lov, så ingen är begränsad till de exempel vi ger.

Läs först igenom kom-igång hjälpen 

-  [Övergripande dokumentation API:etJobSearch](https://jobtechdev.se/sv/components/jobsearch)
-  [Kom-igång guide](https://gitlab.com/arbetsformedlingen/education/education-api/-/blob/main/GETTING_STARTED.md)

## Prova att utforska datan med vår interaktiva tjänst 

Görs genom att öppna Swagger-sidan för API:et (för att enkelt testa olika endpoints i API:et och läsa dokumentation för respektive endpoint): Search job ads (jobtechdev.se) 

## Uppgift 

Använd endpoint https://jobsearch.api.jobtechdev.se/ för att använda/söka bland befintliga annonser. 
Det går även bra att använda historiska annonser om ni vill jämföra aktuella annonser med hur det har sett ut tidigare. Detta api finns här: Historical job ads (jobtechdev.se)

Om möjligt, använd en grafisk presentation av era resultat genom t.ex. stapeldiagram eller linjegrafer.

**Observera**
Er slutprodukt ska ej innehålla Arbetsförmedlingens logga eller färger. Anpassa gärna efter eget tycke och smak så att ni har en färgpalett och en god tanke bakom. 

## Betygskriterier 

### Need-to-have (G) 
- Ni har hämtat data på ett strukturerat sätt med hjälp av antingen fetch eller axios. 
- Ni har skapat en tjänst som ni använder för att hämta data. 
- Ni använder react-koncept vi har pratat om för att göra datan tillgänglig (context, state, routing et.c.). 
- Ni använder den syntax, namngivningsstandard samt skrivsätt som vi har lärt er.  
- Ni använder designsystemet för presentation. 

### Nice-to-have (Extra bonus) 
- Styled components (som drar nytta av designsystemet) 
- Grafisk presentation av datat 
- Användning av custom hook där det finns möjlighet

## 🔍 ESLint-varningar:
- C:\Work\AssignmentCorrector\backend\repos\fed24d-case-af-jobtech-team-4-1\src\contexts\JobContext.ts - no-unused-vars - 'key' is defined but never used.
- C:\Work\AssignmentCorrector\backend\repos\fed24d-case-af-jobtech-team-4-1\src\reducers\JobReducer.ts - no-unused-vars - 'SET_JOBS' is defined but never used.,no-unused-vars - 'SET_PAGINATION' is defined but never used.
- C:\Work\AssignmentCorrector\backend\repos\fed24d-case-af-jobtech-team-4-1\src\services\jobAdService.ts - no-unused-vars - 'FRONTEND' is defined but never used.,no-unused-vars - 'BACKEND' is defined but never used.,no-unused-vars - 'FULLSTACK' is defined but never used.,no-unused-vars - 'ALL' is defined but never used.

## 🏆 **Betyg: G**
📌 **Motivering:** Uppgiften uppfyller G-kraven: data hämtas strukturerat via fetch i en tjänstelager (serviceBase + jobAdService), React-koncept används korrekt (context, useReducer, state, routing), och designsystemet från Arbetsförmedlingen används och tematiseras med egen färgpalett och utan AF-logga. Koden är i huvudsak välstrukturerad och läsbar. Bonus: ni har en enkel custom hook (useDebounce) och geolokationsbaserad filtrering.

💡 **Förbättringsförslag:**  
- Samordna filtrering och paginering: Pagination i AdsPresentation använder getJobAdsPaginated (utan filters/location) och övertrumfar filtrerade resultat från SearchFiltersDigi. Bygg in filters + userLocation + offset i getJobAds och låt både initial hämtning och paginering använda samma funktion/params (inkludera offset i buildSearchUrl-anropet). Detta undviker dubblett-hämtningar samt inkonsekventa resultat.
- Lägg till robust felhantering i serviceBase.get: kontrollera response.ok, kasta tydliga fel och hantera nätverksfel; överväg AbortController för timeouts.
- Rensa och konsolidera CSS: AdsPresentation.scss innehåller duplicerade selektorer (.width, .ads-container) och stilar för en äldre pagineringslösning (pagination-controls) som inte längre används. Ta bort död kod och minska komplex override mot Shadow DOM-klasser; använd hellre exponerade CSS-variabler/parts från designsystemet.
- Korrigera imports för router: använd react-router-dom för createBrowserRouter, RouterProvider, Link, useNavigate, useParams för att undvika framtida kompatibilitetsproblem.
- Typning: Sätt tydliga typer för workplace_address.coordinates (t.ex. [number, number]) istället för tom array-typ för bättre typesäkerhet i geo-utils.
- Förhindra dubbelhämtning vid sidladdning: AdsPresentation och SearchFiltersDigi triggar initial hämtning var för sig. Centralisera hämtlogik i en hook eller context-action och låt komponenterna endast konsumera state.
- UX: Rensa-knappen i filter triggar geolocation automatiskt, vilket kan överraska användaren. Låt Rensa endast återställa filter och låt användaren själv be om position.
- URL state: Spegla sökfråga/filter i query params så att delning/återbesök bevarar filter.
- Extra (nice-to-have): Lägg till enkel grafisk presentation (t.ex. stapeldiagram över antal annonser per ort eller anställningsform) för bonuspoäng.

## 👥 Gruppbidrag

| Deltagare | Antal commits | Commit % | Uppgiftskomplettering | Totalt bidrag |
| --------- | -------------- | -------- | ---------------------- | ------------- |
| Olivia | 69 | 50.7% | 0.25 | 0.35 |
| matildasoderhall | 57 | 41.9% | 0.25 | 0.32 |
| Yuliia-fed23 | 9 | 6.6% | 0.25 | 0.18 |
| Matilda | 1 | 0.7% | 0.25 | 0.15 |


### 📊 Förklaring
- **Antal commits**: Antalet commits som personen har gjort
- **Commit %**: Procentuell andel av totala commits
- **Uppgiftskomplettering**: Poäng baserad på mappning av README-krav mot kodbidrag 
- **Totalt bidrag**: Viktad bedömning av personens totala bidrag (40% commits, 60% uppgiftskomplettering)
