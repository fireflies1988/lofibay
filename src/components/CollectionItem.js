import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { StyledCollectionItem } from "./styles/Collection.styled";
import { LinkStyles } from "./styles/Link.styled";

function CollectionItem({ item }) {
  const navigate = useNavigate();

  return (
    <StyledCollectionItem>
      <div
        className="thumbnails"
        onClick={() => navigate(`/collections/${item?.collectionId}`)}
      >
        {item?.thumbnails?.length >= 1 ? (
          <img
            className="thumbnails__main"
            alt=""
            src={item?.thumbnails[0]?.photoUrl}
          />
        ) : (
          <div className="thumbnails__main bg--gray"></div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "3px",
            width: "33%",
            height: "100%",
          }}
        >
          {item?.thumbnails?.length >= 2 ? (
            <img
              alt=""
              src={item?.thumbnails[1]?.photoUrl}
              className="thumbnails__tr"
            />
          ) : (
            <div className="thumbnails__tr bg--gray"></div>
          )}

          {item?.thumbnails?.length >= 3 ? (
            <img
              alt=""
              src={item?.thumbnails[2]?.photoUrl}
              className="thumbnails__br"
            />
          ) : (
            <div className="thumbnails__br bg--gray"></div>
          )}
        </div>
      </div>

      <div
        style={{
          cursor: "pointer",
          fontSize: "19px",
          fontWeight: "500",
          marginTop: "10px",
          marginBottom: "2px",
        }}
        onClick={() => navigate(`/collections/${item?.collectionId}`)}
      >
        {item?.collectionName}
      </div>
      <div>
        {item?.numOfPhotos} photos · Curated by{" "}
        <LinkStyles
          style={{ fontWeight: "500" }}
          onClick={() => navigate(`/profiles/${item?.user?.userId}`)}
        >
          {item?.user?.firstName} {item?.user?.lastName}
        </LinkStyles>
      </div>
    </StyledCollectionItem>
  );
}

export default CollectionItem;
