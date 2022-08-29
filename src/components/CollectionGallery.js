import { Container, ImageList, Pagination } from "@mui/material";
import React from "react";
import Collection from "./Collection";

function CollectionGallery({ collections }) {
  return (
    <Container maxWidth="lg">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Collection />
        <Collection />
        <Collection />
      </div>

      <Pagination
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "4rem",
        }}
        count={10}
        variant="outlined"
        color="secondary"
      />
    </Container>
  );
}

export default CollectionGallery;
