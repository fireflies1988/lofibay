import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
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
    Typography
} from "@mui/material";
import { Container } from "@mui/system";
import moment from "moment";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import ColorBar from "react-color-bar";
import { useParams } from "react-router-dom";
import { TagsInput } from "react-tag-input-component";
import ImageEditorDialog from "../components/ImageEditorDialog";
import { LinkStyles } from "../components/styles/Link.styled";
import { useNavigate } from "react-router-dom";
import {
    GET_PHOTO_DETAILS_BY_ID_ENDPOINT_PATH,
    SERVER_URL
} from "../utils/Endpoints";

function bytesToSize(bytes) {
  var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes == 0) return "0 Byte";
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}

function PhotoDetails() {
  const navigate = useNavigate();
  const [rawPhotoInfo, setRawPhotoInfo] = useState();
  const [inputs, setInputs] = useState({
    description: "",
    location: "",
    takenAt: null,
    camera: "",
    software: "",
  });
  const [tags, setTags] = useState([]);
  const { photoId } = useParams();
  const [state, setState] = useState({
    isLoading: false,
  });
  const [colorData, setColorData] = useState([]);
  const [disabled, setDisabed] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
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
    fetchPhotoDetailsByIdAsync(photoId);
  }, []);

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

  function handleCancel(event) {}

  function handleChange(event) {
    const { name, value } = event.target;
    setInputs({ ...inputs, [name]: value });
  }

  return (
    <Container maxWidth="xl" sx={{ mt: "1rem" }}>
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
                onClick={() => navigate(`/profiles/${rawPhotoInfo?.user.userId}`)}
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
                  variant="outlined"
                  startIcon={<FavoriteBorderIcon />}
                  color="success"
                  sx={{ height: "32px", textTransform: "none" }}
                >
                  Like
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<AddCircleOutlineIcon />}
                  color="success"
                  sx={{ height: "32px", textTransform: "none" }}
                >
                  Collect
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ height: "32px", textTransform: "none" }}
                  component="a"
                  href={rawPhotoInfo?.downloadUrl}
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
                <Button
                  variant="outlined"
                  startIcon={<DeleteOutlineIcon />}
                  color="success"
                  sx={{ height: "32px", textTransform: "none" }}
                >
                  Delete
                </Button>

                <ImageEditorDialog photoUrl={rawPhotoInfo?.photoUrl} />

                <Button
                  variant="outlined"
                  startIcon={<ShareIcon />}
                  color="success"
                  sx={{ height: "32px", textTransform: "none" }}
                >
                  Share
                </Button>

                <Button
                  variant="outlined"
                  color="success"
                  sx={{ height: "32px", textTransform: "none" }}
                  startIcon={<FlagIcon />}
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
                  maxRows={2}
                  value={inputs.description}
                  onChange={handleChange}
                  size="small"
                  disabled={disabled}
                />

                <TextField
                  style={{ width: "100%", marginTop: "1rem" }}
                  type="text"
                  id="outlined-error-helper-text"
                  label="Taken at"
                  name="takenAt"
                  value={inputs.takenAt}
                  onChange={handleChange}
                  size="small"
                  disabled={disabled}
                />

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

                <TagsInput
                  value={tags}
                  onChange={setTags}
                  name="tags"
                  placeHolder="Tags"
                  disabled={disabled}
                />

                {!disabled && (
                  <>
                    <LoadingButton
                      loading={state.isUpdating}
                      loadingPosition="start"
                      variant="contained"
                      style={{ marginTop: "1.5rem", marginRight: "1rem" }}
                      color="success"
                      startIcon={<SaveIcon />}
                      type="submit"
                      size="small"
                    >
                      Save changes
                    </LoadingButton>

                    <Button
                      variant="outlined"
                      color="success"
                      style={{ marginTop: "1.5rem" }}
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
