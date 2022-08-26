import styled from "styled-components";

export const HeaderStyles = styled.header`
  background: url(${({ img }) => img}) no-repeat center;
  background-size: cover;
  height: 550px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #e4e4e4;

  .brand {
    color: ${({ theme }) => theme.colors.brandDarkColor};
    font-size: 40px;
  }
`;
