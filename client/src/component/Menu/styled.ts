import styled from "styled-components";

export const Navigation = styled.nav`
  max-width: 300px;
  width: 100%;
  border-right: 1px solid #000;

  ul {
    width: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 15px;

    a {
      color: var(--color-mode);
      &.active,
      &:hover {
        color: var(--active-mode);
      }
    }
  }
`;

Navigation.displayName = "Navigation";
