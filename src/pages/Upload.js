import UploadIcon from "@mui/icons-material/Upload";
import { Alert, Box, Button, Grid, IconButton, TextField } from "@mui/material";
import { Container } from "@mui/system";
import React, { useContext, useState } from "react";
import { LinkStyles } from "../components/styles/Link.styled";
import LoadingButton from "@mui/lab/LoadingButton";
import { TagsInput } from "react-tag-input-component";
import { fetchWithCredentialsAsync } from "../utils/Utils";
import {
  POST_WITH_AUTH_UPLOAD_PHOTO_ENDPOINT_PATH,
  SERVER_URL,
} from "../utils/Api";
import AuthContext from "../context/AuthProvider";

const initialUploadData = {
  previewImageUrl: "",
  imageFile: null,
  description: "",
  location: "",
};
function Upload() {
  const { auth, setAuth } = useContext(AuthContext);
  const [uploadData, setUploadData] = useState(initialUploadData);
  const [tags, setTags] = useState([]);
  const [state, setState] = useState({
    isUploading: false,
  });
  const [messages, setMessages] = useState({
    successMessage: "",
    errorMessage: "",
  });

  function showPreview(e) {
    setUploadData((uploadData) => ({
      ...uploadData,
      previewImageUrl: URL.createObjectURL(e.target.files[0]),
      imageFile: e.target.files[0],
    }));
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setUploadData({ ...uploadData, [name]: value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setState((state) => ({
      ...state,
      isUploading: true,
    }));

    try {
      if (uploadData.imageFile) {
        const formData = new FormData();
        formData.append("ImageFile", uploadData.imageFile);
        formData.append("Description", uploadData.description);
        formData.append("Location", uploadData.location);
        for (let i = 0; i < tags.length; i++) {
          formData.append("tags[]", tags[i]);
        }

        const requestOptions = {
          method: "POST",
          body: formData,
          redirect: "follow",
        };

        const uploadPhotoResponse = await fetchWithCredentialsAsync(
          `${SERVER_URL}${POST_WITH_AUTH_UPLOAD_PHOTO_ENDPOINT_PATH}`,
          requestOptions,
          auth,
          setAuth
        );
        const uploadPhotoResponseData = await uploadPhotoResponse.json();

        if (
          uploadPhotoResponse.status === 400 ||
          uploadPhotoResponse.status === 500 ||
          uploadPhotoResponse.status === 422
        ) {
          setMessages((messages) => ({
            ...messages,
            errorMessage: uploadPhotoResponseData?.message,
          }));
        } else if (uploadPhotoResponse.status === 200) {
          setMessages((messages) => ({
            ...messages,
            successMessage: uploadPhotoResponseData?.message,
          }));

          // reset form
          setUploadData(initialUploadData);
          setTags([]);
        } else {
          setMessages((messages) => ({
            ...messages,
            errorMessage: "Unhandled error.",
          }));
        }
      }
    } catch (err) {
      setMessages((messages) => ({
        ...messages,
        errorMessage: err.message,
      }));
    }

    setState((state) => ({
      ...state,
      isUploading: false,
    }));
  }

  function handleCancel() {
    setUploadData((uploadData) => ({
      ...uploadData,
      previewImageUrl: "",
      imageFile: null,
    }));
  }

  return (
    <Container maxWidth="xl">
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <h1 style={{ textAlign: "center", color: `#00ab4b` }}>
            Submit to Lofibay
          </h1>
          <ul>
            <li>
              Your uploads will be distributed for free under the Lofibay
              license. <LinkStyles>Learn more</LinkStyles>.
            </li>
            <li>
              To increase the chance of being featured, please ensure that your
              submissions meet <LinkStyles>our guidelines</LinkStyles>.
            </li>
            <li>
              We'll review your submission. If it gets selected, you will
              receive an email notification and your content will be featured in
              our search.
            </li>
          </ul>
          <h3 style={{ marginLeft: "1.2rem" }}>Some basic requirements</h3>
          <ul>
            <li>High quality photos (at least 5MP).</li>
            <li>Photos are clear & original.</li>
            <li>Only upload photos you own the rights to.</li>
            <li>Zero tolerance for nudity, violence or hate.</li>
            <li>Respect the intellectual property of others.</li>
          </ul>
        </Grid>
        <Grid item xs={8}>
          <Container maxWidth="xl" sx={{ mt: "2.5rem" }}>
            {messages.errorMessage !== "" && (
              <Alert variant="standard" severity="error" sx={{ width: "100%" }}>
                {messages.errorMessage}
              </Alert>
            )}

            {messages.successMessage && (
              <Alert
                variant="standard"
                severity="success"
                sx={{ width: "100%" }}
              >
                {messages.successMessage}
              </Alert>
            )}

            <Box
              component="div"
              sx={{ p: 2, mt: 1, border: "2px dashed grey", width: "100%" }}
            >
              {!uploadData.imageFile ? (
                <IconButton
                  color="success"
                  aria-label="upload picture"
                  component="label"
                  sx={{ display: "flex", flexDirection: "column", p: 4 }}
                >
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={showPreview}
                  />
                  <UploadIcon sx={{ fontSize: "100px" }} />
                  <div>Browse to choose an image</div>
                </IconButton>
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={7}>
                    <img
                      src={uploadData.previewImageUrl}
                      alt="uploadImage"
                      style={{ width: "100%" }}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      style={{ width: "100%", marginTop: "1rem" }}
                      type="text"
                      id="outlined-error-helper-text"
                      label="Description"
                      name="description"
                      value={uploadData.description}
                      onChange={handleChange}
                      size="small"
                    />

                    <TextField
                      style={{
                        width: "100%",
                        marginTop: "1rem",
                        marginBottom: "1rem",
                      }}
                      type="text"
                      id="outlined-error-helper-text"
                      label="Location"
                      name="location"
                      value={uploadData.location}
                      onChange={handleChange}
                      size="small"
                    />

                    <TagsInput
                      value={tags}
                      onChange={setTags}
                      name="tags"
                      placeHolder="Enter tags"
                    />

                    <LoadingButton
                      loading={state.isUploading}
                      loadingPosition="start"
                      startIcon={<UploadIcon />}
                      variant="contained"
                      style={{ width: "100%", marginTop: "2rem" }}
                      color="success"
                      size="large"
                      onClick={handleSubmit}
                    >
                      Upload
                    </LoadingButton>

                    <Button
                      variant="outlined"
                      color="success"
                      sx={{ mt: "1rem", width: "100%" }}
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              )}
            </Box>
          </Container>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Upload;
