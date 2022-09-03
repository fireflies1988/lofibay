import styled from "styled-components";

export const StyledCollectionItem = styled.div`
  display: flex;
  flex-direction: column;
  width: 380px;
  height: 350px;

  .thumbnails {
    display: flex;
    gap: 3px;
    width: 100%;
    height: 100%;
    max-height: 260px;
    cursor: pointer;

    .bg--gray {
      background-color: #cdcaca;
    }

    &__main {
      width: 67%;
      height: 100%;
      object-fit: cover;
      border-radius: 1rem 0 0 1rem;
    }

    &__tr {
      width: 100%;
      height: 50%;
      object-fit: cover;
      border-radius: 0 1rem 0 0;
    }

    &__br {
      width: 100%;
      height: 50%;
      object-fit: cover;
      border-radius: 0 0 1rem 0;
    }
  }
`;

export const RightColumnOfAddToDialog = styled.div`
  height: 100%;
  overflow: auto;
  padding-right: 1rem;

  .title {
    font-size: 28px;
    font-weight: bold;
  }
`;

export const StyledCollectionCard = styled.div`
  .card {
    height: 80px;
    background: url(${props => props.thumbnail}) no-repeat center;
    background-color: #80808075;
    background-size: cover;
    box-shadow: ${props => props.boxShadow};
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
    color: #ffffffe8;
    cursor: pointer;

    &:hover {
      box-shadow: ${props => props.boxShadowOnHover};
    }

    .card__left {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
  }
`;
