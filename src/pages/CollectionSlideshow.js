import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import SlideshowGallery from "../components/SlideshowGallery";

function CollectionSlideshow() {
  const photos = useOutletContext();
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (photos?.length > 0) {
      setImages(
        photos.map((item) => ({
          original: item?.photoUrl,
          thumbnail: convertToThumbnail(item?.photoUrl),
        }))
      );
    }
  }, [photos]);

  function convertToThumbnail(photoUrl) {
    let insertIndex = photoUrl.indexOf("upload/") + "upload/".length;
    return (
      photoUrl.slice(0, insertIndex) +
      "c_thumb,h_150,w_250,g_faces/" +
      photoUrl.slice(insertIndex)
    );
  }

  return (
    <>
      <h2 style={{ textAlign: "center" }}>Slideshow Gallery</h2>
      <SlideshowGallery images={images}/>
    </>
  );
}

export default CollectionSlideshow;
