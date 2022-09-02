import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import {
  Avatar,
  IconButton,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material";
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useSnackbar } from "notistack";
import { fetchWithCredentialsAsync, youLikedThisPhoto } from "../utils/Utils";
import {
  POST_WITH_AUTH_LIKE_OR_UNLIKE_PHOTO_ENDPOINT_PATH,
  SERVER_URL,
} from "../utils/Endpoints";

function ImageItem({ item }) {
  const { auth, setAuth } = useContext(AuthContext);
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [liked, setLiked] = useState(youLikedThisPhoto(auth, item?.likedPhotos));

  function showSnackbar(variant, message) {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(message, {
      variant,
      anchorOrigin: {
        horizontal: "right",
        vertical: "bottom",
      },
    });
  }

  async function likeOrUnlikePhotoAsync() {
    if (!auth?.accessToken) {
      showSnackbar("info", "You need to login to use this feature.");
      return;
    }

    try {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
      };
      const response = await fetchWithCredentialsAsync(
        `${SERVER_URL}${POST_WITH_AUTH_LIKE_OR_UNLIKE_PHOTO_ENDPOINT_PATH.replace(
          "{id}",
          `${item?.photoId}`
        )}`,
        requestOptions,
        setAuth
      );
      const responseData = await response.json();
      if (response.status === 200) {
        setLiked((liked) => !liked);
      } else {
        showSnackbar("error", responseData?.message);
      }
    } catch (err) {
      showSnackbar("error", err.message);
    }
  }

  return (
    <ImageListItem
      key={item.photoId}
      onMouseOver={() => setIsHovering(true)}
      onMouseOut={() => setIsHovering(false)}
    >
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
                    onClick={likeOrUnlikePhotoAsync}
                  />
                ) : (
                  <FavoriteBorderIcon onClick={likeOrUnlikePhotoAsync} />
                )}
              </IconButton>
              <IconButton
                sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                aria-label={`star ${item.title}`}
                size="large"
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
