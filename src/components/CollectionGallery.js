import { Pagination } from "@mui/material";
import React from "react";
import CollectionItem from "./CollectionItem";

function CollectionGallery({ collections }) {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-evenly", flexWrap: "wrap", marginTop: "1rem" }}>
        {collections?.length > 0 && collections.map((item) => <CollectionItem key={item?.collectionId} item={item} />)}
      </div>

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
    </>
  );
}

export default CollectionGallery;
