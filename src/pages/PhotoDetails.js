import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FlagIcon from "@mui/icons-material/Flag";
import SaveIcon from "@mui/icons-material/Save";
import ShareIcon from "@mui/icons-material/Share";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { LoadingButton } from "@mui/lab";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import ColorBar from "react-color-bar";
import { useNavigate, useParams } from "react-router-dom";
import AddToCollectionDialog from "../components/AddToCollectionDialog";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";
import FixTags from "../components/FixTags";
import ImageEditorDialog from "../components/ImageEditorDialog";
import { LinkStyles } from "../components/styles/Link.styled";
import AuthContext from "../contexts/AuthProvider";
import YourCollectionsContext, { YourCollectionsProvider } from "../contexts/YourCollectionsProvider";
import useFetch from "../hooks/useFetch";
import useNotistack from "../hooks/useNotistack";
import {
  DELETE_WITH_AUTH_SOFT_DELETE_PHOTO_ENPOINT_PATH,
  GET_PHOTO_DETAILS_BY_ID_ENDPOINT_PATH,
  PUT_WITH_AUTH_UPDATE_PHOTO_INFO_ENDPOINT_PATH,
  SERVER_URL,
} from "../utils/Endpoints";
import { isThisPhotoAlreadyInOneOfYourCollection, youLikedThisPhoto } from "../utils/Utils";

function bytesToSize(bytes) {
  var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes == 0) return "0 Byte";
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}

function PhotoDetails() {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  const [rawPhotoInfo, setRawPhotoInfo] = useState();
  const [inputs, setInputs] = useState({
    description: "",
    location: "",
    takenAt: null,
    camera: "",
    software: "",
  });
  const { yourCollections, setYourCollections } = useContext(
    YourCollectionsContext
  );
  const [tags, setTags] = useState([]);
  const { photoId } = useParams();
  const [state, setState] = useState({
    isUpdating: false,
  });
  const [colorData, setColorData] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [liked, setLiked] = useState(false);
  const { showSnackbar } = useNotistack();
  const [addToDialogOpened, setAddToDialogOpened] = useState(false);
  const [collected, setCollected] = useState(false);
  const {
    fetchWithCredentialsAsync,
    increaseDownloadsByOneAsync,
    likeOrUnlikePhotoAsync,
  } = useFetch();

  useEffect(() => {
    fetchPhotoDetailsByIdAsync(photoId);
  }, []);

  useEffect(() => {
    setLiked(youLikedThisPhoto(rawPhotoInfo?.likedPhotos));
    setDisabled(!isOwner());
  }, [rawPhotoInfo]);

  useEffect(() => {
    setCollected(
      isThisPhotoAlreadyInOneOfYourCollection(photoId, yourCollections)
    );
  }, [photoId, yourCollections]);

  function isOwner() {
    return rawPhotoInfo?.user?.userId === auth?.userId;
  }

  async function fetchPhotoDetailsByIdAsync(photoId) {
    try {
      const response = await fetch(
        `${SERVER_URL}${GET_PHOTO_DETAILS_BY_ID_ENDPOINT_PATH.replace(
          "{id}",
          `${photoId}`
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

      if (response.status === 404 || response.status === 500) {
        showSnackbar("error", responseData?.message);
      } else if (response.status === 200) {
        setRawPhotoInfo(responseData?.data);

        const photoColors = responseData?.data?.photoColors;
        let colors = [];
        for (let i = 0; i < photoColors?.length; i++) {
          if (photoColors[i]?.colorAnalyzer?.colorAnalyzerId === 2) {
            colors.push({
              value: photoColors[i].predominantPercent,
              color: photoColors[i].colorName,
              legendLabel: photoColors[i].colorName,
              legendValue: photoColors[i].predominantPercent,
              tooltip: `${photoColors[i].colorName} occupies ${photoColors[i].predominantPercent}`,
            });
          }
        }
        setColorData(colors);

        setInputs((inputs) => ({
          ...inputs,
          description: responseData?.data?.description,
          location: responseData?.data?.location,
          takenAt: responseData?.data?.takenAt,
          camera: responseData?.data?.camera,
          software: responseData?.data?.software,
        }));

        const photoTags = responseData?.data?.photoTags;
        let tagList = [];
        for (let i = 0; i < photoTags?.length; i++) {
          tagList.push(photoTags[i]?.tagName);
        }
        setTags(tagList);
      } else {
        showSnackbar("error", "Unknown error.");
      }
    } catch (err) {
      showSnackbar("error", err.message);
    }
  }

  async function updatePhotoInfoAsync(photoId) {
    try {
      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        body: JSON.stringify({
          ...inputs,
          tags,
        }),
      };
      const response = await fetchWithCredentialsAsync(
        `${SERVER_URL}${PUT_WITH_AUTH_UPDATE_PHOTO_INFO_ENDPOINT_PATH.replace(
          "{id}",
          `${rawPhotoInfo?.photoId}`
        )}`,
        requestOptions
      );
      const responseData = await response.json();

      if (response.status === 200) {
        showSnackbar("success", responseData?.message);
      } else if (
        response.status === 404 ||
        response.status === 401 ||
        response.status === 500
      ) {
        showSnackbar("error", responseData?.message);
      } else {
        showSnackbar("error", "Unkown error.");
      }
    } catch (err) {
      showSnackbar("error", err.message);
    }
  }

  async function deletePhotoAsync(photoId) {
    try {
      const requestOptions = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
      };
      const response = await fetchWithCredentialsAsync(
        `${SERVER_URL}${DELETE_WITH_AUTH_SOFT_DELETE_PHOTO_ENPOINT_PATH.replace(
          "{id}",
          `${rawPhotoInfo?.photoId}`
        )}`,
        requestOptions
      );
      const responseData = await response.json();

      if (response.status === 200) {
        showSnackbar("success", responseData?.message);
        navigate(`/profiles/${auth?.userId}`);
      } else if (
        response.status === 404 ||
        response.status === 401 ||
        response.status === 422
      ) {
        showSnackbar("error", responseData?.message);
      } else {
        showSnackbar("error", "Unkown error.");
      }
    } catch (err) {
      showSnackbar("error", err.message);
    }
  }

  async function handleSubmit(event) {
    setState((state) => ({ ...state, isUpdating: true }));

    await updatePhotoInfoAsync(photoId);

    setState((state) => ({ ...state, isUpdating: false }));
  }

  async function handleDeletePhoto(event) {
    await deletePhotoAsync(photoId);
  }

  function handleCancel(event) {}

  function handleChange(event) {
    const { name, value } = event.target;
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  }

  function handleClickAddToCollectionButton() {
    if (!auth?.accessToken) {
      showSnackbar("info", "You need to login to use this feature.");
      return;
    }
    setAddToDialogOpened(true);
  }

  return (
    <Container maxWidth="xl" sx={{ mt: "1rem" }}>
      <AddToCollectionDialog
        open={addToDialogOpened}
        onClose={() => setAddToDialogOpened(false)}
        photoId={photoId}
        photoUrl={rawPhotoInfo?.photoUrl}
      />
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Paper variant="outlined" sx={{ padding: "0.75rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <LinkStyles
                component="div"
                onClick={() =>
                  navigate(`/profiles/${rawPhotoInfo?.user.userId}`)
                }
                style={{
                  fontWeight: "normal",
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <Avatar
                  alt={rawPhotoInfo?.user?.username}
                  src={rawPhotoInfo?.user?.avatarUrl}
                  sx={{ width: 45, height: 45 }}
                />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div>
                    {rawPhotoInfo?.user?.firstName}{" "}
                    {rawPhotoInfo?.user?.lastName}
                  </div>
                  <div>@{rawPhotoInfo?.user?.username}</div>
                </div>
              </LinkStyles>
              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <Button
                  variant={liked ? "contained" : "outlined"}
                  startIcon={<FavoriteBorderIcon />}
                  color={liked ? "error" : "success"}
                  sx={{ height: "32px", textTransform: "none" }}
                  onClick={() =>
                    likeOrUnlikePhotoAsync(
                      rawPhotoInfo?.photoId,
                      liked,
                      setLiked
                    )
                  }
                >
                  {liked ? "Liked" : "Like"}
                </Button>
                <Button
                  variant={collected ? "contained" : "outlined"}
                  startIcon={<AddCircleOutlineIcon />}
                  color={collected ? "error" : "success"}
                  sx={{ height: "32px", textTransform: "none" }}
                  onClick={handleClickAddToCollectionButton}
                >
                  Collect
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ height: "32px", textTransform: "none" }}
                  component="a"
                  href={rawPhotoInfo?.downloadUrl}
                  onClick={() =>
                    increaseDownloadsByOneAsync(rawPhotoInfo?.photoId)
                  }
                >
                  Download
                </Button>
              </div>
            </div>

            <Container
              maxWidth="xl"
              sx={{ display: "flex", justifyContent: "center", p: "1.5rem" }}
            >
              <img
                src={rawPhotoInfo?.photoUrl}
                alt={rawPhotoInfo?.photoId}
                style={{ maxHeight: "70vh", maxWidth: "100%" }}
              />
            </Container>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <VisibilityIcon /> <span>&nbsp;Views</span>
                  </div>
                  <div>{rawPhotoInfo?.views}</div>
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FileDownloadOutlinedIcon />
                    <span>&nbsp;Downloads</span>
                  </div>
                  <div>{rawPhotoInfo?.downloads}</div>
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FavoriteOutlinedIcon /> <span>&nbsp;Likes</span>
                  </div>
                  <div>{rawPhotoInfo?.likes}</div>
                </div>
              </div>

              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                {!disabled && (
                  <ConfirmDeleteDialog
                    buttonText="Delete"
                    buttonSize="small"
                    title="Delete photo"
                    content="Are you sure you want to delete this photo?"
                    onConfirm={handleDeletePhoto}
                  />
                )}

                <ImageEditorDialog photoUrl={rawPhotoInfo?.photoUrl} />

                <Button
                  variant="outlined"
                  startIcon={<ShareIcon />}
                  color="success"
                  sx={{ textTransform: "none" }}
                  size="small"
                >
                  Share
                </Button>

                <Button
                  variant="outlined"
                  color="success"
                  sx={{ textTransform: "none" }}
                  startIcon={<FlagIcon />}
                  size="small"
                >
                  Report
                </Button>
              </div>
            </div>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper variant="outlined" sx={{ padding: "0.75rem" }}>
            <h2 style={{ color: "#00ab4b" }}>Photo information</h2>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>
                  <b>Details</b>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Published on{" "}
                  {moment(rawPhotoInfo?.uploadedAt).format("MMMM Do YYYY")}
                </Typography>

                <TextField
                  id="outlined-basic"
                  style={{ marginTop: "1rem" }}
                  label="Description"
                  name="description"
                  variant="outlined"
                  multiline
                  fullWidth
                  rows={2}
                  value={inputs.description}
                  onChange={handleChange}
                  size="small"
                  disabled={disabled}
                />

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    label="Taken at"
                    inputFormat="MM/DD/YYYY"
                    value={inputs.takenAt}
                    onChange={(newValue) =>
                      setInputs({ ...inputs, takenAt: newValue })
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        sx={{ mt: "1rem", width: "100%" }}
                        size="small"
                      />
                    )}
                    disabled={disabled}
                  />
                </LocalizationProvider>

                <TextField
                  style={{ width: "100%", marginTop: "1rem" }}
                  type="text"
                  id="outlined-error-helper-text"
                  label="Location"
                  name="location"
                  value={inputs.location}
                  onChange={handleChange}
                  size="small"
                  disabled={disabled}
                />

                <TextField
                  style={{ width: "100%", marginTop: "1rem" }}
                  type="text"
                  id="outlined-error-helper-text"
                  label="Camera"
                  name="camera"
                  value={inputs.camera}
                  onChange={handleChange}
                  size="small"
                  disabled={disabled}
                />

                <TextField
                  style={{ width: "100%" }}
                  sx={{ my: "1rem" }}
                  type="text"
                  id="outlined-error-helper-text"
                  label="Software"
                  name="software"
                  value={inputs.software}
                  onChange={handleChange}
                  size="small"
                  disabled={disabled}
                />

                <FixTags
                  value={tags}
                  setValue={setTags}
                  fixedOptions={[]}
                  disabled={disabled}
                />

                {!disabled && (
                  <>
                    <LoadingButton
                      loading={state.isUpdating}
                      loadingPosition="start"
                      variant="contained"
                      sx={{
                        marginTop: "1.5rem",
                        marginRight: "1rem",
                        textTransform: "none",
                      }}
                      color="success"
                      startIcon={<SaveIcon />}
                      onClick={handleSubmit}
                      size="small"
                    >
                      Save changes
                    </LoadingButton>

                    <Button
                      variant="outlined"
                      color="success"
                      sx={{ marginTop: "1.5rem", textTransform: "none" }}
                      onClick={handleCancel}
                      size="small"
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Typography>
                  <b>Metadata</b>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <p>◆ Format: {rawPhotoInfo?.format}</p>
                  <p>
                    ◆ Dimensions: {rawPhotoInfo?.width} x {rawPhotoInfo?.height}
                  </p>
                  <p>◆ File size: {bytesToSize(rawPhotoInfo?.fileSize)}</p>
                  <p>◆ Grayscale: 0</p>
                  <p>◆ Semi-transparent: 0</p>
                  <p>◆ Phash: {rawPhotoInfo?.phash}</p>
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3a-content"
                id="panel3a-header"
              >
                <Typography>
                  <b>Color analysis</b>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>Predominant Colors (%)</Typography>
                {colorData.length > 0 && <ColorBar data={colorData} />}
                <div>&nbsp;</div>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3a-content"
                id="panel3a-header"
              >
                <Typography>
                  <b>Face detection</b>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  {rawPhotoInfo?.facesDetected} face(s) detected
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default PhotoDetails;
