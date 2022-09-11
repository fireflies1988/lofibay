import { Button, Container, Grid, Paper } from "@mui/material";
import React, { useContext } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthProvider";

function AdminDashboard() {
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
          <h2>Admin dashboard</h2>
          <Paper variant="outlined" sx={{ padding: "0.5rem" }}>
            <Button
              onClick={() => navigate("/admin")}
              style={{
                textTransform: "none",
                width: "100%",
                justifyContent: "flex-start",
              }}
              color="success"
              variant={lastSegment === "admin" ? "outlined" : "text"}
            >
              Uploaded photos
            </Button>
            <Button
              onClick={() => navigate("featured-photos")}
              style={{
                textTransform: "none",
                width: "100%",
                justifyContent: "flex-start",
              }}
              color="success"
              variant={lastSegment === "featured-photos" ? "outlined" : "text"}
            >
              Featured photos
            </Button>
            <Button
              onClick={() => navigate("rejected-photos")}
              style={{
                textTransform: "none",
                width: "100%",
                justifyContent: "flex-start",
              }}
              color="success"
              variant={lastSegment === "rejected-photos" ? "outlined" : "text"}
            >
              Rejected photos
            </Button>
            <Button
              onClick={() => navigate("deleted-photos")}
              style={{
                textTransform: "none",
                width: "100%",
                justifyContent: "flex-start",
              }}
              color="success"
              variant={lastSegment === "deleted-photos" ? "outlined" : "text"}
            >
              Deleted photos
            </Button>
            <Button
              onClick={() => navigate("tags")}
              style={{
                textTransform: "none",
                width: "100%",
                justifyContent: "flex-start",
              }}
              color="success"
              variant={lastSegment === "tags" ? "outlined" : "text"}
            >
              Tags
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

export default AdminDashboard;
