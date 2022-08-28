import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import {
  Avatar,
  IconButton,
  ImageListItem,
  ImageListItemBar
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ImageItem({ item }) {
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();

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
                <FavoriteBorderIcon />
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
        alt={item.photoId}
        loading="lazy"
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
                to="#"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/${item?.user?.userId}`)}
              >
                <Avatar alt={item?.user?.userId} src={item?.user?.avatarUrl} sx={{ width: 34, height: 34 }} />
                <span style={{ fontSize: "17px" }}>{item?.user?.firstName} {item?.user?.lastName}</span>
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
