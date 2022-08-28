import CollectionsIcon from "@mui/icons-material/Collections";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhotoIcon from "@mui/icons-material/Photo";
import { TabContext, TabPanel } from "@mui/lab";
import { Avatar, Button, CircularProgress, Grid, Tab, Tabs } from "@mui/material";
import { Box, Container } from "@mui/system";
import { useSnackbar } from "notistack";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageGallery from "../components/ImageGallery";
import AuthContext from "../context/AuthProvider";
import { GET_PHOTOS_THAT_USER_LIKED_ENDPOINT_PATH, GET_USER_INFO_BY_ID_ENDPOINT_PATH, GET_USER_UPLOADED_PHOTOS_ENDPOINT_PATH, SERVER_URL } from "../utils/Api";

function Profile() {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const { userId } = useParams();
  const [value, setValue] = useState("1");
  const [userInfo, setUserInfo] = useState({
    firstName: "Steven",
    lastName: "King",
    biography: "",
    country: "America",
    avatarUrl: "",
    userId: "",
  });
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [likedPhotos, setLikedPhotos] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [state, setState] = useState({
    isLoading: true,
    loadingText: "Fetching data, please stand by...",
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
    if (!/\d+/.test(userId)) {
      navigate("/");
    }
    fetchUserInfoById(userId);
  }, [userId]);

  useEffect(() => {
    if (value === "1") {
      fetchUploadedPhotosByUserId(userId);
    }
    if (value === "2") {
      fetchLikedPhotosAsync(userId);
    }
  }, [value]);

  async function fetchLikedPhotosAsync(userId) {
    try {
      const response = await fetch(`${SERVER_URL}${GET_PHOTOS_THAT_USER_LIKED_ENDPOINT_PATH.replace("{id}", `${userId}`)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow"
      });
      const responseData = await response.json();

      if (response.status === 200) {
        setLikedPhotos(responseData?.data);
      } else {
        showSnackbar("error", responseData?.message);
      }
    } catch (err) {
      showSnackbar("error", err.message);
    }
  }

  async function fetchUserInfoById(userId) {
    const userInfoResponse = await fetch(
      `${SERVER_URL}${GET_USER_INFO_BY_ID_ENDPOINT_PATH.replace(
        "{id}",
        `${userId}`
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
      }
    );
    const userInfoResponseData = await userInfoResponse.json();
    if (userInfoResponse.status === 200) {
      setUserInfo((userInfo) => ({
        ...userInfo,
        firstName: userInfoResponseData?.data?.firstName,
        lastName: userInfoResponseData?.data?.lastName,
        biography: userInfoResponseData?.data?.biography,
        country: userInfoResponseData?.data?.address?.country,
        avatarUrl: userInfoResponseData?.data?.avatarUrl,
        userId: userInfoResponseData?.data?.userId,
      }));
    }
  }

  async function fetchUploadedPhotosByUserId(userId) {
    try {
      const response = await fetch(`${SERVER_URL}${GET_USER_UPLOADED_PHOTOS_ENDPOINT_PATH.replace("{id}", `${userId}`)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow"
      });
      const responseData = await response.json();

      if (response.status === 404) {
        showSnackbar("error", responseData?.message);
      } else if (response.status === 200) {
        setUploadedPhotos(responseData?.data);
      }
    } catch (err) {
      showSnackbar("error", err.message);
    }

    setState((state) => ({
      ...state,
      isLoading: false,
    }));
  }

  return (
    <>
      <Container style={{ maxWidth: "750px", marginTop: "2rem" }}>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Avatar
              alt="Remy Sharp"
              src={userInfo.avatarUrl}
              sx={{ width: 150, height: 150 }}
            />
          </Grid>
          <Grid item xs={9}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span style={{ fontSize: "42px", fontWeight: "bold" }}>
                {userInfo.firstName} {userInfo.lastName}
              </span>
              {userInfo.userId === auth.userId && (
                <Button
                  startIcon={<EditIcon />}
                  variant="outlined"
                  color="success"
                  size="small"
                  sx={{ textTransform: "none" }}
                  onClick={() => navigate("/account")}
                >
                  Edit profile
                </Button>
              )}
            </div>

            <div style={{ fontSize: "16px", marginTop: "1rem" }}>
              {userInfo.biography
                ? userInfo.biography
                : "Download free, beautiful high-quality photos curated by Steven."}
            </div>
            <div
              style={{
                fontSize: "16px",
                marginTop: "0.75rem",
                display: "flex",
                alignItems: "center",
              }}
            >
              <LocationOnIcon sx={{ color: "#a3a3a3" }} />{" "}
              <span>{userInfo.country ? userInfo.country : "Unknown"}</span>
            </div>
          </Grid>
        </Grid>
      </Container>
      <Container maxWidth="xl" sx={{ marginTop: "3rem" }}>
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "#e6cfcf" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="lab API tabs example"
                textColor="secondary"
                indicatorColor="secondary"
              >
                <Tab
                  label="Photos"
                  value="1"
                  icon={<PhotoIcon />}
                  iconPosition="start"
                  sx={{ textTransform: "none" }}
                />
                <Tab
                  label="Likes"
                  value="2"
                  icon={<FavoriteIcon />}
                  iconPosition="start"
                  sx={{ textTransform: "none" }}
                />
                <Tab
                  label="Collections"
                  value="3"
                  icon={<CollectionsIcon />}
                  iconPosition="start"
                  sx={{ textTransform: "none" }}
                />
              </Tabs>
            </Box>
            <TabPanel value="1">
              {state.isLoading ? (
                <>
                  <CircularProgress color="success" />
                  <h4>{state.loadingText}</h4>
                </>
              ) : (
                <ImageGallery photos={uploadedPhotos} />
              )}
            </TabPanel>
            <TabPanel value="2">
              <ImageGallery photos={likedPhotos} />
            </TabPanel>
            <TabPanel value="3">Item Three</TabPanel>
          </TabContext>
        </Box>
      </Container>
    </>
  );
}

export default Profile;
