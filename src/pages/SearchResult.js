import CollectionsIcon from "@mui/icons-material/Collections";
import PhotoIcon from "@mui/icons-material/Photo";
import { TabContext, TabPanel } from "@mui/lab";
import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CircularProgressWithText from "../components/CircularProgressWithText";
import CollectionGallery from "../components/CollectionGallery";
import ImageGallery from "../components/ImageGallery";
import useNotistack from "../hooks/useNotistack";
import {
  GET_ALL_COLORS_ENPOINT_PATH,
  GET_SEARCH_COLLECTIONS_BY_KEYWORD_ENDPOINT_PATH,
  GET_SEARCH_PHOTOS_BY_KEYWORD_ENDPOINT_PATH
} from "../utils/Endpoints";
import { headers } from "../utils/Utils";

function SearchResult() {
  const [value, setValue] = useState("1");
  const { keywords } = useParams();
  const [orientation, setOrientation] = useState("any");
  const [color, setColor] = useState("any");
  const [colorOptions, setColorOptions] = useState([]);
  const [sortBy, setSortBy] = useState("relevance");
  const { showSnackbar } = useNotistack();
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [loadingCollections, setLoadingCollections] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [collections, setCollections] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    fetchColorOptionsAsync();
  }, []);

  useEffect(() => {
    searchPhotosAsync(keywords, orientation, color, sortBy);
  }, [keywords, orientation, color, sortBy]);

  useEffect(() => {
    searchCollectionsAsync(keywords);
  }, [keywords]);

  async function searchPhotosAsync(keywords, orientation, color, sortBy) {
    setLoadingPhotos(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}${GET_SEARCH_PHOTOS_BY_KEYWORD_ENDPOINT_PATH.replace(
          "{keywords}",
          keywords
        )
          .replace("{orientation}", orientation)
          .replace("{color}", color)
          .replace("{sortBy}", sortBy)}`,
        {
          method: "GET",
          headers: headers({
            "Content-Type": "application/json",
          }),
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
        `${process.env.REACT_APP_SERVER_URL}${GET_SEARCH_COLLECTIONS_BY_KEYWORD_ENDPOINT_PATH.replace(
          "{keywords}",
          keywords
        )}`,
        {
          method: "GET",
          headers: headers({
            "Content-Type": "application/json",
          }),
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

  async function fetchColorOptionsAsync() {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}${GET_ALL_COLORS_ENPOINT_PATH}`,
        {
          method: "GET",
          headers: headers({
            "Content-Type": "application/json",
          }),
          redirect: "follow",
        }
      );
      const responseData = await response.json();

      if (response.status === 200) {
        setColorOptions(responseData?.data);
      } else {
        showSnackbar("error", "Unknown error.");
      }
    } catch (err) {
      showSnackbar("error", err.message);
    }
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
              <div>
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
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                  <InputLabel id="demo-select-small">Color</InputLabel>
                  <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    value={color}
                    label="Age"
                    onChange={(e) => setColor(e.target.value)}
                  >
                    <MenuItem value="any">Any color</MenuItem>
                    {colorOptions?.length > 0 &&
                      colorOptions?.map((item, index) => (
                        <MenuItem value={item?.name} key={index}>
                          <span
                            style={{
                              backgroundColor: item?.name,
                              width: "22px",
                              height: "22px",
                            }}
                          ></span>
                          &nbsp;{item?.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                  <InputLabel id="demo-select-small">Sort by</InputLabel>
                  <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    value={sortBy}
                    label="Age"
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <MenuItem value="relevance">Relevance</MenuItem>
                    <MenuItem value="newest">Newest</MenuItem>
                  </Select>
                </FormControl>
              </div>
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
