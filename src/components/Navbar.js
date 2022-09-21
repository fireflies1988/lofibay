import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { Badge, Button, Grid, IconButton, Popover } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../contexts/AuthProvider";
import useFetch from "../hooks/useFetch";
import useNotistack from "../hooks/useNotistack";
import {
  GET_WITH_AUTH_NOTIFICATIONS_ENDPOINT_PATH,
  PATCH_WITH_AUTH_MARK_NOTIFICATIONS_AS_READ_ENDPOINT_PATH
} from "../utils/Endpoints";
import { getAccessToken, headers } from "../utils/Utils";
import AccountMenu from "./AccountMenu";
import NotificationItem from "./NotificationItem";
import SearchBar from "./SearchBar";
import { Nav } from "./styles/Nav.styled";

function Navbar() {
  const { auth } = useContext(AuthContext);
  const isLoggedIn = auth?.accessToken !== null;
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const { showSnackbar } = useNotistack();
  const { fetchWithCredentialsAsync } = useFetch();
  const [notifications, setNotifications] = useState([]);
  const previousNotifications = useRef([]);

  async function handleClick(event) {
    setAnchorEl(event.currentTarget);
    await markNotificationAsReadAsync();
  };

  function handleClose() {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    if (getAccessToken()) {
      fetchNotificationsAsync();
    }
  }, []);

  useEffect(() => {
    previousNotifications.current = notifications;
  }, [notifications]);

  async function fetchNotificationsAsync() {
    try {
      const response = await fetchWithCredentialsAsync(
        `${process.env.REACT_APP_SERVER_URL}${GET_WITH_AUTH_NOTIFICATIONS_ENDPOINT_PATH}`,
        {
          method: "GET",
          headers: headers(),
          redirect: "follow",
        }
      );
      const responseData = await response.json();

      if (response.status === 200) {
        setNotifications(responseData?.data);
      } else {
        showSnackbar("error", "Unknown error.");
      }
    } catch (err) {
      showSnackbar("error", err.message);
    }
  }

  async function markNotificationAsReadAsync() {
    try {
      const response = await fetchWithCredentialsAsync(
        `${process.env.REACT_APP_SERVER_URL}${PATCH_WITH_AUTH_MARK_NOTIFICATIONS_AS_READ_ENDPOINT_PATH}`,
        {
          method: "PATCH",
          headers: headers(),
          redirect: "follow",
        }
      );
      const responseData = await response.json();

      if (response.status === 200) {
        await fetchNotificationsAsync();
      } else {
        showSnackbar("error", "Unknown error.");
      }
    } catch (err) {
      showSnackbar("error", err.message);
    }
  }

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
              <IconButton
                aria-label="delete"
                size="large"
                onClick={handleClick}
              >
                <Badge badgeContent={notifications?.filter(n => n.read === false)?.length} color="success" max={99}>
                  <NotificationsNoneIcon fontSize="inherit" />
                </Badge>
              </IconButton>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                PaperProps={{
                  style: { width: "350px", height: "600px", padding: "1rem" },
                }}
              >
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: "bold",
                  }}
                >
                  Notifications
                </div>
                {previousNotifications.current?.length > 0 &&
                  previousNotifications.current?.map((item) => (
                    <NotificationItem
                      key={item?.notificationId}
                      read={item?.read}
                      imageUrl={item?.imageUrl}
                      content={item?.message}
                      time={item?.notificationTime}
                    />
                  ))}
              </Popover>
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
