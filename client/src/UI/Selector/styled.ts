import styled from "styled-components";

export const Select = styled.select`
  width: 100%;
  height: fit-content;
  color: var(--color-mode);
  text-transform: capitalize;

  padding: var(--small-gap) 0;
  border: 1px solid var(--color-mode);
  border-radius: 10px;

  cursor: pointer;
  position: relative;
`;
Select.displayName = "Select";

export const Fieldset = styled.fieldset`
  display: flex;
  flex-direction: column;
  row-gap: var(--small-gap);
  width: 100%;
`;

Fieldset.displayName = "Fieldset";


