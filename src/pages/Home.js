import { Container } from "@mui/system";
import React from "react";
import Header from "../components/Header";
import ImageGallery from "../components/ImageGallery";
import { HomeStyles } from "../components/styles/Home.styled";

function Home() {
  return (
    <HomeStyles>
      <Header />
      <Container maxWidth="xl">
        <h2 className="title">Free Stock Photos</h2>
        <ImageGallery />
      </Container>
    </HomeStyles>
  );
}

export default Home;
