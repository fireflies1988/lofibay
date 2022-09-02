import { Avatar } from "@mui/material";
import { Container } from "@mui/system";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CircularProgressWithText from "../components/CircularProgressWithText";
import ImageGallery from "../components/ImageGallery";
import {
  GET_COLLECTION_INFO_ENPOINT_PATH,
  GET_PHOTOS_OF_COLLECTION_ENDPOINT_PATH,
  SERVER_URL,
} from "../utils/Endpoints";

function Collection() {
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const [collectionInfo, setCollectionInfo] = useState();
  const [photos, setPhotos] = useState();

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

  useEffect(() => {
    fetchCollectionInfoAsync(collectionId);
    fetchPhotosOfCollectionsAsync(collectionId);
  }, [collectionId]);

  async function fetchCollectionInfoAsync(collectionId) {
    try {
      const response = await fetch(
        `${SERVER_URL}${GET_COLLECTION_INFO_ENPOINT_PATH.replace(
          "{id}",
          `${collectionId}`
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow",
        }
      );
      const responseData = await response.json();

      if (response.status === 404) {
        showSnackbar("error", responseData?.message);
      } else if (response.status === 200) {
        setCollectionInfo(responseData?.data);
      } else {
        showSnackbar("error", "Unknown error.");
      }
    } catch (err) {
      showSnackbar("error", err.message);
    }
  }

  async function fetchPhotosOfCollectionsAsync(collectionId) {
    setLoading(true);
    try {
      const response = await fetch(
        `${SERVER_URL}${GET_PHOTOS_OF_COLLECTION_ENDPOINT_PATH.replace(
          "{id}",
          `${collectionId}`
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow",
        }
      );
      const responseData = await response.json();

      if (response.status === 404) {
        showSnackbar("error", responseData?.message);
      } else if (response.status === 200) {
        setPhotos(responseData?.data);
      } else {
        showSnackbar("error", "Unknown error.");
      }
    } catch (err) {
      showSnackbar("error", err.message);
    }
    setLoading(false);
  }

  return (
    <Container maxWidth="xl" sx={{ textAlign: "center" }}>
      <h1>{collectionInfo?.collectionName}</h1>
      <p>
        {collectionInfo?.description}
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          color: "gray",
          justifyContent: "center",
          marginBottom: "2rem"
        }}
      >
        <span style={{ fontStyle: "italic" }}>{photos?.length} photos collected by </span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
          }}
          onClick={() => navigate(`/collections/3`)}
        >
          <Avatar alt="" src="" sx={{ width: 32, height: 32 }} />
          <span>{collectionInfo?.firstName} {collectionInfo?.lastName}</span>
        </span>
      </div>

      <CircularProgressWithText loading={loading}>
        <ImageGallery photos={photos}/>
      </CircularProgressWithText>
    </Container>
  );
}

export default Collection;
