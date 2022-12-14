import { Container } from "@mui/system";
import React, { useEffect, useState } from "react";
import CircularProgressWithText from "../components/CircularProgressWithText";
import Header from "../components/Header";
import ImageGallery from "../components/ImageGallery";
import { HomeStyles } from "../components/styles/Home.styled";
import useNotistack from "../hooks/useNotistack";
import { GET_ALL_PHOTOS_ENDPOINT_PATH } from "../utils/Endpoints";
import { headers } from "../utils/Utils";

function Home() {
  const [photos, setPhotos] = useState([]);
  const { showSnackbar } = useNotistack()
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPhotosAsync();
  }, []);

  async function fetchPhotosAsync() {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}${GET_ALL_PHOTOS_ENDPOINT_PATH}`,
        {
          method: "GET",
          headers: headers(),
          redirect: "follow",
        }
      );
      const responseData = await response.json();

      if (response.status === 200) {
        setPhotos(responseData?.data);
      } else {
        showSnackbar("error", "Unkown error.");
      }
    } catch (err) {
      showSnackbar("error", err.message);
    }
    setLoading(false);
  }

  return (
    <HomeStyles>
      <Header />
      <Container maxWidth="xl">
        <h2 className="title">Free Stock Photos</h2>
        <CircularProgressWithText loading={loading}>
          <ImageGallery photos={photos} />
        </CircularProgressWithText>
      </Container>
    </HomeStyles>
  );
}

export default Home;
