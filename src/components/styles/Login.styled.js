import styled from "styled-components";
import bgImg from "../../assets/pexels-pixabay-40896.jpg"

export const LoginContainer = styled.div`
  background: url(${bgImg}) no-repeat center;
  background-size: cover;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  form {
    width: 80%;
    max-width: 400px;
    height: auto;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 2rem;

    .title {
      text-align: center;
      color: rgb(8, 179, 53);
      margin-bottom: 2rem;
    }

    .error-text {
      text-align: right;
      font-size: small;
      font-weight: bold;
    }

    a {
      text-align: left;
      color: rgb(75, 75, 75);

      &:link,
      &:visited {
        text-decoration: none;
      }

      &:hover {
        color: rgb(11, 176, 47);
      }
    }

    .forgot-password {
      text-align: right;
    }

    .register {
      margin-top: 0.75rem;
      color: grey;
      text-align: center;
    }
  }
`;
