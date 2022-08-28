import CollectionsIcon from "@mui/icons-material/Collections";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhotoIcon from "@mui/icons-material/Photo";
import { TabContext, TabPanel } from "@mui/lab";
import { Avatar, Button, Grid, Tab, Tabs } from "@mui/material";
import { Box, Container } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ImageGallery from "../components/ImageGallery";
import { GET_USER_INFO_BY_ID_ENDPOINT_PATH, SERVER_URL } from "../utils/Api";

function Profile() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [value, setValue] = useState("1");
  const [userInfo, setUserInfo] = useState({
    firstName: "Steven",
    lastName: "King",
    biography: "",
    country: "America",
    avatarUrl: "",
    userId: 0,
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (!/\d+/.test(userId)) {
      navigate("/");
    }
    fetchUserInfoById(userId);
  }, [userId]);

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
              {userInfo.userId == userId && (
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
              <ImageGallery />
            </TabPanel>
            <TabPanel value="2">
              <ImageGallery />
            </TabPanel>
            <TabPanel value="3">Item Three</TabPanel>
          </TabContext>
        </Box>
      </Container>
    </>
  );
}

export default Profile;
