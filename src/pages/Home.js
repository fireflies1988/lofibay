import { Container } from "@mui/system";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import ImageGallery from "../components/ImageGallery";
import { HomeStyles } from "../components/styles/Home.styled";
import { useSnackbar } from "notistack";
import { GET_ALL_PHOTOS_ENDPOINT_PATH, SERVER_URL } from "../utils/Api";

function Home() {
  const [photos, setPhotos] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

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
    fetchPhotosAsync();
  }, []);

  async function fetchPhotosAsync() {
    try {
      const response = await fetch(
        `${SERVER_URL}${GET_ALL_PHOTOS_ENDPOINT_PATH}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow",
        }
      );
      const responseData = await response.json();

      if (response.status === 200) {
        setPhotos(responseData?.data);
      } else {
        showSnackbar("error", responseData?.message);
      }
    } catch (err) {
      showSnackbar("error", err.message);
    }
  }

  return (
    <HomeStyles>
      <Header />
      <Container maxWidth="xl">
        <h2 className="title">Free Stock Photos</h2>
        <ImageGallery photos={photos}/>
      </Container>
    </HomeStyles>
  );
}

export default Home;
