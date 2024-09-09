import styled from "styled-components";

export const PageWidth = styled.div`
  max-width: 1440px;
  padding: var(--page-padding);
  margin: 0 auto;
  box-sizing: border-box;
  height: 100%;

  display: grid;
  grid-template-columns: 200px 1fr;
  column-gap: var(--x-gap);
`;

PageWidth.displayName = "PageWidth";
