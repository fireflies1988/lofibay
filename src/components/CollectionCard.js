import AddIcon from "@mui/icons-material/Add";
import DoneIcon from "@mui/icons-material/Done";
import LockIcon from "@mui/icons-material/Lock";
import RemoveIcon from "@mui/icons-material/Remove";
import { Paper } from "@mui/material";
import React, { useContext, useState } from "react";
import YourCollectionsContext from "../contexts/YourCollectionsProvider";
import useFetch from "../hooks/useFetch";
import useNotistack from "../hooks/useNotistack";
import {
  POST_WITH_AUTH_ADD_OR_REMOVE_PHOTO_TO_OR_FROM_COLLECTION_ENDPOINT_PATH
} from "../utils/Endpoints";
import { headers } from "../utils/Utils";
import { StyledCollectionCard } from "./styles/Collection.styled";

function CollectionCard({ collection, photoId }) {
  const [isAdded, setIsAdded] = useState(
    isThisPhotoInThisCollection(photoId, collection)
  );
  const [isHovering, setIsHovering] = useState(false);
  const { fetchWithCredentialsAsync, fetchYourCollectionsAsync } = useFetch();
  const { showSnackbar } = useNotistack();
  const { setYourCollections } = useContext(YourCollectionsContext);

  function isThisPhotoInThisCollection(photoId, yourCollection) {
    for (let i = 0; i < yourCollection?.photoCollections?.length; i++) {
      if (photoId == yourCollection?.photoCollections[i]?.photoId) {
        return true;
      }
    }
    return false;
  }

  async function addOrRemovePhotoToOrFromCollectionAsync(
    collectionId,
    photoId
  ) {
    try {
      const response = await fetchWithCredentialsAsync(
        `${process.env.REACT_APP_SERVER_URL}${POST_WITH_AUTH_ADD_OR_REMOVE_PHOTO_TO_OR_FROM_COLLECTION_ENDPOINT_PATH.replace(
          "{id}",
          `${collectionId}`
        ).replace("{photoId}", `${photoId}`)}`,
        {
          method: "POST",
          headers: headers({
            "Content-Type": "application/json",
          }),
          redirect: "follow",
        }
      );
      const responseData = await response.json();
      if (response.status === 200) {
        await fetchYourCollectionsAsync(setYourCollections);
        setIsAdded((isAdded) => !isAdded);
      } else if (
        response.status === 404 ||
        response.status === 422 ||
        response.status === 401
      ) {
        showSnackbar("error", responseData?.message);
      } else {
        showSnackbar("error", "Unknown error.");
      }
    } catch (err) {
      showSnackbar("error", err.message);
    }
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
        onClick={() =>
          addOrRemovePhotoToOrFromCollectionAsync(
            collection?.collectionId,
            photoId
          )
        }
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
