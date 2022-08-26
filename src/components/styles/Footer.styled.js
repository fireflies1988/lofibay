import styled from "styled-components";

export const FooterStyles = styled.footer`
  max-width: 1200px;
  margin: 3rem auto;
  padding: 3rem 3rem 1rem 3rem;

  ul {
    padding: 0;
    list-style: none;
  }

  .footer__container {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    row-gap: 2rem;
    display: grid;
    gap: 1.5rem;
  }

  .footer__brand {
    font-size: 22px;
    color: #069c54;
    font-weight: 700;
  }

  .footer__description {
    display: block;
    margin: 0.25rem 0 1.5rem;
  }

  .footer__social {
    font-size: 1.5rem;
    color: #393939;
    margin-right: 1rem;
  }

  .footer__title {
    font-size: 18px;
    color: #393939;
    margin-bottom: 1rem;
  }

  .footer__link {
    display: inline-block;
    color: #707070;
    margin-bottom: 0.5rem;
  }

  .footer__link:hover {
    color: #069c54;
  }

  .footer__copy {
    text-align: center;
    font-size: 15px;
    color: #a6a6a6;
    margin-top: 3.5rem;
  }
`;
