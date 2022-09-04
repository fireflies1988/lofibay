import { Button, Grid, Paper } from "@mui/material";
import Container from "@mui/material/Container";
import React, { useContext } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../contexts/AuthProvider";

function Account() {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const lastSegment = location.pathname.substring(
    location.pathname.lastIndexOf("/") + 1
  );

  return (
    <Container maxWidth="xl" sx={{ marginTop: "1.5rem" }}>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <h2>Account settings</h2>
          <Paper variant="outlined" sx={{ padding: "0.5rem" }}>
            <Button
              onClick={() => navigate("/account")}
              style={{
                textTransform: "none",
                width: "100%",
                justifyContent: "flex-start",
              }}
              color="success"
              variant={lastSegment === "account" ? "outlined" : "text"}
            >
              Edit profile
            </Button>
            <Button
              onClick={() => navigate("password")}
              style={{
                textTransform: "none",
                width: "100%",
                justifyContent: "flex-start",
              }}
              color="success"
              variant={lastSegment === "password" ? "outlined" : "text"}
            >
              Change password
            </Button>
            <Button
              onClick={() => navigate("verify")}
              style={{
                textTransform: "none",
                width: "100%",
                justifyContent: "flex-start",
              }}
              color="success"
              variant={lastSegment === "verify" ? "outlined" : "text"}
            >
              Verify your email
            </Button>
            <Button
              onClick={() => navigate("delete")}
              style={{
                textTransform: "none",
                width: "100%",
                justifyContent: "flex-start",
              }}
              color="success"
              variant={lastSegment === "delete" ? "outlined" : "text"}
            >
              Delete account
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={9}>
          <Outlet />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Account;
