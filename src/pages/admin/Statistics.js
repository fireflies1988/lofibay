import { Card, CardContent, Grid, Paper } from "@mui/material";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Pie } from "react-chartjs-2";
import useFetch from "../../hooks/useFetch";
import useNotistack from "../../hooks/useNotistack";
import {
  GET_WITH_AUTH_STATS_ENDPOINT_PATH,
  SERVER_URL,
} from "../../utils/Endpoints";

ChartJS.register(ArcElement, Tooltip, Legend);

function Statistics() {
  const { fetchWithCredentialsAsync } = useFetch();
  const { showSnackbar } = useNotistack();
  const [photoStats, setPhotoStats] = useState();
  const [userStats, setUserStats] = useState();
  const [collectionStats, setCollectionStats] = useState();

  useEffect(() => {
    fetchStatsAsync();
  }, []);

  async function fetchStatsAsync() {
    try {
      const response = await fetchWithCredentialsAsync(
        `${SERVER_URL}${GET_WITH_AUTH_STATS_ENDPOINT_PATH}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow",
        }
      );
      const responseData = await response.json();

      if (response.status === 200) {
        setPhotoStats({
          total: responseData?.data?.numberOfPhotos,
          data: [
            responseData?.data?.numberOfUnfeaturedPhotos,
            responseData?.data?.numberOfFeaturedPhotos,
            responseData?.data?.numberOfRejectedPhotos,
            responseData?.data?.numberOfDeletedPhotos,
          ],
        });

        setUserStats({
          total: responseData?.data?.numberOfUsers,
          data: [
            responseData?.data?.numberOfUnverifiedUsers,
            responseData?.data?.numberOfVerifiedUsers,
          ],
        });

        setCollectionStats({
          total: responseData?.data?.numberOfCollections,
          data: [
            responseData?.data?.numberOfPrivateCollections,
            responseData?.data?.numberOfPublicCollections,
          ],
        });
      } else {
        showSnackbar("error", "Unknown error.");
      }
    } catch (err) {
      showSnackbar("error", err.message);
    }
  }

  return (
    <>
      <h2>Statistics</h2>
      <Paper variant="outlined" sx={{ padding: "0.75rem" }}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Card>
              <CardContent>
                <h3>NUMBER OF PHOTOS</h3>
                <Pie
                  data={{
                    labels: ["Unfeatured", "Featured", "Rejected", "Deleted"],
                    datasets: [
                      {
                        label: "Photo stats",
                        data: photoStats?.data,
                        backgroundColor: [
                          "rgba(255, 99, 132, 0.2)",
                          "rgba(54, 162, 235, 0.2)",
                          "rgba(255, 206, 86, 0.2)",
                          "rgba(75, 192, 192, 0.2)",
                        ],
                        borderColor: [
                          "rgba(255, 99, 132, 1)",
                          "rgba(54, 162, 235, 1)",
                          "rgba(255, 206, 86, 1)",
                          "rgba(75, 192, 192, 1)",
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                />
                <h4 style={{ textAlign: "center" }}>TOTAL: {photoStats?.total}</h4>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card>
              <CardContent>
                <h3>NUMBER OF USERS</h3>
                <Pie
                  data={{
                    labels: ["Unverified", "Verified"],
                    datasets: [
                      {
                        label: "User stats",
                        data: userStats?.data,
                        backgroundColor: [
                          "rgba(255, 99, 132, 0.2)",
                          "rgba(54, 162, 235, 0.2)",
                        ],
                        borderColor: [
                          "rgba(255, 99, 132, 1)",
                          "rgba(54, 162, 235, 1)",
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                />
                <h4 style={{ textAlign: "center" }}>TOTAL: {userStats?.total}</h4>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card>
              <CardContent>
                <h3>NUMBER OF COLLECTIONS</h3>
                <Pie
                  data={{
                    labels: ["Private", "Public"],
                    datasets: [
                      {
                        label: "Collectioin stats",
                        data: collectionStats?.data,
                        backgroundColor: [
                          "rgba(255, 99, 132, 0.2)",
                          "rgba(54, 162, 235, 0.2)",
                        ],
                        borderColor: [
                          "rgba(255, 99, 132, 1)",
                          "rgba(54, 162, 235, 1)",
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                />
                <h4 style={{ textAlign: "center" }}>TOTAL: {collectionStats?.total}</h4>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}

export default Statistics;
