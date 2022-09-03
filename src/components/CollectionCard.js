import AddIcon from "@mui/icons-material/Add";
import DoneIcon from "@mui/icons-material/Done";
import LockIcon from "@mui/icons-material/Lock";
import RemoveIcon from "@mui/icons-material/Remove";
import { Paper } from "@mui/material";
import React, { useState } from "react";
import { StyledCollectionCard } from "./styles/Collection.styled";

function CollectionCard({ collection, photoId }) {
  const [isAdded, setIsAdded] = useState(
    isThisPhotoInThisCollection(photoId, collection)
  );
  const [isHovering, setIsHovering] = useState(false);

  function isThisPhotoInThisCollection(photoId, yourCollection) {
    for (let i = 0; i < yourCollection?.photoCollections?.length; i++) {
      if (photoId == yourCollection?.photoCollections[i]?.photoId) {
        return true;
      }
    }
    return false;
  }

  return (
    <StyledCollectionCard
      boxShadow={
        !isAdded
          ? "inset 0 0 0 1000px rgba(0, 0, 0, 0.25)"
          : "inset 0 0 0 1000px rgb(29 255 4 / 30%)"
      }
      boxShadowOnHover={
        !isAdded
          ? "inset 0 0 0 1000px rgba(0, 0, 0, 0.5)"
          : "inset 0 0 0 1000px rgb(29 255 4 / 35%)"
      }
      thumbnail={collection?.thumbnails[0]?.photoUrl}
    >
      <Paper
        onMouseOver={() => setIsHovering(true)}
        onMouseOut={() => setIsHovering(false)}
        className="card"
      >
        <div className="card__left">
          <div style={{ fontSize: "14px" }}>
            {collection?.numOfPhotos} photos
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {collection?.isPrivate && <LockIcon fontSize="small" />}
            <span style={{ fontSize: "18px" }}>
              {collection?.collectionName}
            </span>
          </div>
        </div>
        {!isAdded && isHovering && <AddIcon sx={{ color: "#ffffffe8" }} />}
        {isAdded && isHovering && <RemoveIcon sx={{ color: "#ffffffe8" }} />}
        {isAdded && !isHovering && <DoneIcon sx={{ color: "#ffffffe8" }} />}
      </Paper>
    </StyledCollectionCard>
  );
}

export default CollectionCard;
