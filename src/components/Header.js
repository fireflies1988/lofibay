import React from "react";
import { HeaderStyles } from "./styles/Header.styled";
import img from "../assets/pexels-snapwire-34950.jpg";
import { Container } from "@mui/system";
import SearchBar from "./SearchBar";

function Header() {
  return (
    <Container maxWidth="xl" style={{ padding: 0 }}>
      <HeaderStyles img={img}>
        <Container maxWidth="sm" style={{ height: "90%", display: "flex", alignItems: "center" }}>
          <div>
            <h1 className="brand">Lofibay</h1>
            <h3 className="description">
              The best free stock photos, royalty free images shared by
              creators.
            </h3>
            <SearchBar />
            <h4 className="trending">
              Trending: flower, wallpapers, backgrounds, happy, love
            </h4>
          </div>
        </Container>
        <Container maxWidth="xl" style={{ height: "10%", textAlign: "center", backgroundImage: "linear-gradient(#0000001c, #000000a1)" }}>
          <h4 className="author">Photo by Author</h4>
        </Container>
      </HeaderStyles>
    </Container>
  );
}

export default Header;
