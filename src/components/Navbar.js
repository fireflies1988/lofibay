import { Grid } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import { Nav } from "./styles/Nav.styled";

function Navbar() {
  return (
    <Nav>
      <Grid container spacing={3} sx={{ alignItems: "center" }}>
        <Grid item xs={1}>
          <Link to="/"><h2 className="brand">Lofibay</h2></Link>
        </Grid>
        <Grid item xs={9}>
          <SearchBar />
        </Grid>
        <Grid item xs={1} sx={{ textAlign: "right" }}>
          <Link to="/login" className="nav-link">Login</Link>
        </Grid>
        <Grid item xs={1} sx={{ textAlign: "left" }}>
          <Link to="/register" className="nav-link">Join</Link>
        </Grid>
      </Grid>
    </Nav>
  );
}

export default Navbar;
