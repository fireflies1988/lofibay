import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import {
  Avatar,
  IconButton,
  ImageListItem,
  ImageListItemBar,
  Link,
} from "@mui/material";
import React, { useState } from "react";

function ImageItem({ item }) {
  const [isHovering, setIsHovering] = useState(true);

  return (
    <ImageListItem
      key={item.img}
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
        src={`${item.img}?w=248&fit=crop&auto=format`}
        srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
        alt={item.title}
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
              <div to="#" style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => console.log("hello")}>
                <Avatar>H</Avatar>
                <span style={{ fontSize: "18px"}}>{item.title}</span>
              </div>
            </>
          }
          actionIcon={
            <IconButton
              sx={{ color: "rgba(255, 255, 255, 0.8)" }}
              aria-label={`info about ${item.title}`}
              size="large"
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
