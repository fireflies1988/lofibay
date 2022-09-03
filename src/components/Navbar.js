import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { Button, Grid, IconButton } from "@mui/material";
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../contexts/AuthProvider";
import AccountMenu from "./AccountMenu";
import SearchBar from "./SearchBar";
import { Nav } from "./styles/Nav.styled";

function Navbar() {
  const { auth } = useContext(AuthContext);
  const isLoggedIn = auth?.accessToken !== null;
  const navigate =useNavigate();

  return (
    <Nav>
      <Grid container spacing={3} sx={{ alignItems: "center" }}>
        <Grid item xs={1}>
          <Link to="/">
            <h2 className="brand">Lofibay</h2>
          </Link>
        </Grid>
        <Grid item xs>
          <SearchBar />
        </Grid>
        {isLoggedIn ? (
          <>
            <Grid item xs={1} sx={{ textAlign: "right" }}>
              <Button
                variant="contained"
                color="success"
                sx={{ textAlign: "right", textTransform: "none" }}
                size="medium"
                onClick={() => navigate("upload")}
              >
                Upload
              </Button>
            </Grid>
            <Grid item xs={0.5} sx={{ textAlign: "right" }}>
              <IconButton aria-label="delete" size="large">
                <NotificationsNoneIcon fontSize="inherit" />
              </IconButton>
            </Grid>
            <Grid item xs={1} sx={{ textAlign: "left" }}>
              <AccountMenu />
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={1} sx={{ textAlign: "right" }}>
              <Link to="/login" className="nav-link">
                Login
              </Link>
            </Grid>
            <Grid item xs={1} sx={{ textAlign: "left" }}>
              <Link to="/register" className="nav-link">
                Join
              </Link>
            </Grid>
          </>
        )}
      </Grid>
    </Nav>
  );
}

export default Navbar;
