import styled from "styled-components";

export const SettingsDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  column-gap: var(--y-gap);
  row-gap: var(--x-gap);

  & > * {
    max-width: calc(100% / 2 - var(--y-gap) * 1 / 2);
  }
`;

SettingsDiv.displayName = "SettingsDiv";
