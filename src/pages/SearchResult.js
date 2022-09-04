import { TabContext, TabPanel } from "@mui/lab";
import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CollectionsIcon from "@mui/icons-material/Collections";
import PhotoIcon from "@mui/icons-material/Photo";
import { useParams } from "react-router-dom";
import {
  GET_SEARCH_COLLECTIONS_BY_KEYWORD_ENDPOINT_PATH,
  GET_SEARCH_PHOTOS_BY_KEYWORD_ENDPOINT_PATH,
  SERVER_URL,
} from "../utils/Endpoints";
import useNotistack from "../hooks/useNotistack";
import CircularProgressWithText from "../components/CircularProgressWithText";
import ImageGallery from "../components/ImageGallery";
import CollectionGallery from "../components/CollectionGallery";

function SearchResult() {
  const [value, setValue] = useState("1");
  const { keywords } = useParams();
  const [orientation, setOrientation] = useState("any");
  const { showSnackbar } = useNotistack();
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [loadingCollections, setLoadingCollections] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [collections, setCollections] = useState([]);

  console.log(keywords);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    searchPhotosAsync(keywords);
    searchCollectionsAsync(keywords);
  }, [keywords]);

  async function searchPhotosAsync(keywords) {
    setLoadingPhotos(true);
    try {
      const response = await fetch(
        `${SERVER_URL}${GET_SEARCH_PHOTOS_BY_KEYWORD_ENDPOINT_PATH.replace(
          "{keywords}",
          keywords
        )}`,
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
        setPhotos(responseData?.data);
      } else {
        showSnackbar("error", "Unknown error.");
      }
    } catch (err) {
      showSnackbar("error", err.message);
    }
    setLoadingPhotos(false);
  }

  async function searchCollectionsAsync(keywords) {
    setLoadingCollections(true);
    try {
      const response = await fetch(
        `${SERVER_URL}${GET_SEARCH_COLLECTIONS_BY_KEYWORD_ENDPOINT_PATH.replace(
          "{keywords}",
          keywords
        )}`,
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
        setCollections(responseData?.data);
      } else {
        showSnackbar("error", "Unknown error.");
      }
    } catch (err) {
      showSnackbar("error", err.message);
    }
    setLoadingCollections(false);
  }

  return (
    <Container maxWidth="xl" sx={{ marginTop: "1rem" }}>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "#e6cfcf",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="lab API tabs example"
              textColor="secondary"
              indicatorColor="secondary"
            >
              <Tab
                label={`Photos ${photos?.length}`}
                value="1"
                icon={<PhotoIcon />}
                iconPosition="start"
                sx={{ textTransform: "none" }}
              />
              <Tab
                label={`Collections ${collections?.length}`}
                value="2"
                icon={<CollectionsIcon />}
                iconPosition="start"
                sx={{ textTransform: "none" }}
              />
            </Tabs>

            {value === "1" && (
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="demo-select-small">Orientation</InputLabel>
                <Select
                  labelId="demo-select-small"
                  id="demo-select-small"
                  value={orientation}
                  label="Age"
                  onChange={(e) => setOrientation(e.target.value)}
                >
                  <MenuItem value="any">Any orientation</MenuItem>
                  <MenuItem value="landscape">Landscape</MenuItem>
                  <MenuItem value="portrait">Portrait</MenuItem>
                  <MenuItem value="square">Square</MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>
          <h2>Search results for {keywords}</h2>
          <TabPanel value="1">
            <CircularProgressWithText loading={loadingPhotos}>
              <ImageGallery photos={photos} />
            </CircularProgressWithText>
          </TabPanel>
          <TabPanel value="2">
            <CircularProgressWithText loading={loadingCollections}>
              <CollectionGallery collections={collections} />
            </CircularProgressWithText>
          </TabPanel>
        </TabContext>
      </Box>
    </Container>
  );
}

export default SearchResult;
