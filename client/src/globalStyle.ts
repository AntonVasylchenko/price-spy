import { createGlobalStyle } from "styled-components";

const customMediaQuery = (maxWidth: number) =>
  `@media (max-width: ${maxWidth}px)`;

export const media = {
  custom: customMediaQuery,
  desktop: customMediaQuery(1140),
  tablet: customMediaQuery(998),
  mobile: customMediaQuery(768),
};

export const GlobalStyle = createGlobalStyle<{ themeName: string }>`
    :root {
        --primary-font: Montserrat;
        --secondary-font: Montserrat;

        --color-mode: ${(props) =>
          props.themeName === "light" ? "#000000" : "#ffffff"};
        --active-mode: ${(props) =>
          props.themeName === "light" ? "#007bff" : "#ff8c00"};
        --background-mode: ${(props) =>
          props.themeName === "light" ? "#ffffff" : "#000000"};

        --head-text: 24px; 
        --body-text: 20px;

        --x-gap: 30px; 
        --y-gap: 30px; 

        --page-padding: 40px 80px;

        --large-gap: 25px;
        --medium-gap: 20px;
        --small-gap: 15px;

        ${media.tablet} {
          --head-text: 22px; 
          --body-text: 18px; 

          --x-gap: 25px; 
          --y-gap: 25px; 

          --page-padding: 30px 40px;

          --large-gap: 20px;
          --medium-gap: 15px;
          --small-gap: 10px;

        } 
        ${media.mobile} {
          --head-text: 20px; 
          --body-text: 16px; 

          --x-gap: 15px; 
          --y-gap: 15px; 

          --page-padding: 20px 15px;

          --large-gap: 15px;
          --medium-gap: 10px;
          --small-gap: 5px;

        } 
    }

    body,
    html,
    #root {
        font: normal 400 var(--body-text)/1 var(--primary-font);
        letter-spacing: 0px;
        height: 100%;
        background-color: var(--background-mode);
        color: var(--color-mode);
    }
`;
