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