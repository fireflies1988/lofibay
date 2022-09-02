import styled from "styled-components";

export const LinkStyles = styled.a`
  font-weight: bold;
  font-size: 17px;
  color: rgb(75, 75, 75);
  cursor: pointer;

  &:link,
  &:visited {
    text-decoration: none;
  }

  &:hover {
    color: rgb(11, 176, 47);
  }
`;
