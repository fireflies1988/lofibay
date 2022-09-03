import { ConstructionOutlined } from "@mui/icons-material";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import {
  Avatar,
  IconButton,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../contexts/AuthProvider";
import YourCollectionsContext from "../contexts/YourCollectionsProvider";
import useFetch from "../hooks/useFetch";
import useNotistack from "../hooks/useNotistack";
import { isThisPhotoAlreadyInOneOfYourCollection, youLikedThisPhoto } from "../utils/Utils";
import AddToCollectionDialog from "./AddToCollectionDialog";

function ImageItem({ item }) {
  const { auth, setAuth } = useContext(AuthContext);
  const { yourCollections, setYourCollections } = useContext(YourCollectionsContext);
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();
  const { showSnackbar } = useNotistack();
  const [liked, setLiked] = useState(youLikedThisPhoto(item?.likedPhotos));
  const [collected, setCollected] = useState(false);
  const { increaseDownloadsByOneAsync, likeOrUnlikePhotoAsync } = useFetch();
  const [addToDialogOpened, setAddToDialogOpened] = useState(false);

  useEffect(() => {
    setCollected(isThisPhotoAlreadyInOneOfYourCollection(item?.photoId, yourCollections));
  }, [item?.photoId, yourCollections]);

  function handleClickAddToCollectionButton() {
    if (!auth?.accessToken) {
      showSnackbar("info", "You need to login to use this feature.");
      return;
    }
    setAddToDialogOpened(true);
  }

  return (
    <ImageListItem
      key={item.photoId}
      onMouseOver={() => setIsHovering(true)}
      onMouseOut={() => setIsHovering(false)}
    >
      <AddToCollectionDialog
        open={addToDialogOpened}
        onClose={() => setAddToDialogOpened(false)}
        photoId={item?.photoId}
        photoUrl={item?.photoUrl}
      />
      {isHovering && (
        <ImageListItemBar
          sx={{
            background:
              "linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%,rgba(255, 255, 255, 0) 100%)",
            trasition: "0.3s",
          }}
          position="top"
          actionIcon={
            <>
              <IconButton
                sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                aria-label={`star ${item.title}`}
                size="large"
              >
                {liked ? (
                  <FavoriteIcon
                    sx={{ color: "red" }}
                    onClick={() =>
                      likeOrUnlikePhotoAsync(item?.photoId, liked, setLiked)
                    }
                  />
                ) : (
                  <FavoriteBorderIcon
                    onClick={() =>
                      likeOrUnlikePhotoAsync(item?.photoId, liked, setLiked)
                    }
                  />
                )}
              </IconButton>
              <IconButton
                sx={{ color: collected ? "red" : "rgba(255, 255, 255, 0.8)" }}
                aria-label={`star ${item.title}`}
                size="large"
                onClick={handleClickAddToCollectionButton}
              >
                <AddCircleOutlineOutlinedIcon />
              </IconButton>
            </>
          }
          actionPosition="right"
        />
      )}
      <img
        src={`${item?.photoUrl}?w=248&fit=crop&auto=format`}
        srcSet={`${item?.photoUrl}?w=248&fit=crop&auto=format&dpr=2 2x`}
        alt={`${item?.photoId}`}
        loading="lazy"
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/photos/${item?.photoId}`)}
      />
      {isHovering && (
        <ImageListItemBar
          sx={{
            background:
              "linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%,rgba(255, 255, 255, 0) 100%)",
            trasition: "0.3s",
          }}
          title={
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/profiles/${item?.user?.userId}`)}
              >
                <Avatar
                  alt={`${item?.user?.userId}`}
                  src={item?.user?.avatarUrl}
                  sx={{ width: 34, height: 34 }}
                />
                <span style={{ fontSize: "17px" }}>
                  {item?.user?.firstName} {item?.user?.lastName}
                </span>
              </div>
            </>
          }
          actionIcon={
            <IconButton
              sx={{ color: "rgba(255, 255, 255, 0.8)" }}
              aria-label={`info about ${item?.photoId}`}
              size="large"
              href={item?.downloadUrl}
              onClick={() => increaseDownloadsByOneAsync(item?.photoId)}
            >
              <FileDownloadOutlinedIcon />
            </IconButton>
          }
        />
      )}
    </ImageListItem>
  );
}

export default ImageItem;
