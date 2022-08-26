import styled from "styled-components";

export const Nav = styled.nav`
  background: #fff;
  padding: 0 1rem;
  border-bottom: 2px solid #e5e5e5;

  .brand {
    color: ${({ theme }) => theme.colors.brandLightColor};
  }

  .nav-link {
    font-weight: bold;
    font-size: 18px;
    color: rgb(75, 75, 75);

    &:link,
    &:visited {
      text-decoration: none;
    }

    &:hover {
      color: rgb(11, 176, 47);
    }
  }
`;
