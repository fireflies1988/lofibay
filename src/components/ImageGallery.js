import { Container, ImageList, Pagination } from "@mui/material";
import React from "react";
import { YourCollectionsProvider } from "../contexts/YourCollectionsProvider";
import ImageItem from "./ImageItem";

function ImageGallery({ photos }) {
  return (
    <YourCollectionsProvider>
      <Container maxWidth="xl">
        <ImageList variant="masonry" cols={4} gap={8}>
          {photos?.length > 0 &&
            photos.map((photo, index) => (
              <ImageItem item={photo} key={index} />
            ))}
        </ImageList>

        {/* <Pagination
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "4rem",
          }}
          count={10}
          variant="outlined"
          color="secondary"
        /> */}
      </Container>
    </YourCollectionsProvider>
  );
}

export default ImageGallery;
