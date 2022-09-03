import { InputSharp } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import SaveIcon from "@mui/icons-material/Save";
import {
  Avatar,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  TextField,
} from "@mui/material";
import { Container } from "@mui/system";
import { useSnackbar } from "notistack";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CircularProgressWithText from "../components/CircularProgressWithText";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";
import ImageGallery from "../components/ImageGallery";
import AuthContext from "../context/AuthProvider";
import {
  DELETE_WITH_AUTH_COLLECTION_BY_ID_ENDPOINT_PATH,
  GET_COLLECTION_INFO_ENPOINT_PATH,
  GET_PHOTOS_OF_COLLECTION_ENDPOINT_PATH,
  PATCH_WITH_AUTH_UPDATE_COLLECTION_BY_ID_ENDPOINT_PATH,
  SERVER_URL,
} from "../utils/Endpoints";
import { fetchWithCredentialsAsync, getUserId } from "../utils/Utils";

function Collection() {
  const { auth, setAuth } = useContext(AuthContext);
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const [collectionInfo, setCollectionInfo] = useState();
  const [photos, setPhotos] = useState();
  const [open, setOpen] = useState(false);
  const [inputs, setInputs] = useState({
    collectionName: "",
    description: "",
    isPrivate: false,
  });

  const handleClickOpen = () => {
    setOpen(true);
    setInputs({
      collectionName: collectionInfo?.collectionName,
      description: collectionInfo?.description,
      isPrivate: collectionInfo?.isPrivate,
    });
  };

  function handleChange(event) {
    const { name, value } = event.target;
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  }

  const handleClose = () => {
    setOpen(false);
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
    fetchCollectionInfoAsync(collectionId);
  }, [collectionId]);

  async function fetchCollectionInfoAsync(collectionId) {
    try {
      const response = await fetch(
        `${SERVER_URL}${GET_COLLECTION_INFO_ENPOINT_PATH.replace(
          "{id}",
          `${collectionId}`
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

      if (response.status === 404) {
        showSnackbar("error", responseData?.message);
      } else if (response.status === 200) {
        if (responseData?.data?.isPrivate) {
          if (getUserId() == responseData?.data?.user?.userId) {
            setCollectionInfo(responseData?.data);
            await fetchPhotosOfCollectionsAsync(collectionId);
          } else {
            showSnackbar(
              "error",
              "You can't view this collection because it is private."
            );
          }
        } else {
          setCollectionInfo(responseData?.data);
          await fetchPhotosOfCollectionsAsync(collectionId);
        }
      } else {
        showSnackbar("error", "Unknown error.");
      }
    } catch (err) {
      showSnackbar("error", err.message);
    }
  }

  async function fetchPhotosOfCollectionsAsync(collectionId) {
    setLoading(true);
    try {
      const response = await fetch(
        `${SERVER_URL}${GET_PHOTOS_OF_COLLECTION_ENDPOINT_PATH.replace(
          "{id}",
          `${collectionId}`
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

      if (response.status === 404) {
        showSnackbar("error", responseData?.message);
      } else if (response.status === 200) {
        setPhotos(responseData?.data);
      } else {
        showSnackbar("error", "Unknown error.");
      }
    } catch (err) {
      showSnackbar("error", err.message);
    }
    setLoading(false);
  }

  async function updateCollectionAsync(collectionId) {
    try {
      const response = await fetchWithCredentialsAsync(
        `${SERVER_URL}${PATCH_WITH_AUTH_UPDATE_COLLECTION_BY_ID_ENDPOINT_PATH.replace(
          "{id}",
          `${collectionId}`
        )}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow",
          body: JSON.stringify({
            ...inputs
          })
        },
        setAuth
      );
      const responseData = await response.json();

      if (
        response.status === 404 ||
        response.status === 401 ||
        response.status === 422
      ) {
        showSnackbar("error", responseData?.message);
      } else if (response.status === 200) {
        showSnackbar("success", responseData?.message);
        setCollectionInfo((collectionInfo) => ({
          ...collectionInfo,
          ...inputs,
        }));
        handleClose();
      } else {
        showSnackbar("error", "Unknown error.");
      }
    } catch (err) {
      showSnackbar("error", err.message);
    }
  }

  async function deleteCollectionAsync(collectionId) {
    try {
      const response = await fetchWithCredentialsAsync(
        `${SERVER_URL}${DELETE_WITH_AUTH_COLLECTION_BY_ID_ENDPOINT_PATH.replace(
          "{id}",
          `${collectionId}`
        )}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow"
        },
        setAuth
      );
      const responseData = await response.json();

      if (
        response.status === 404 ||
        response.status === 401 ||
        response.status === 422
      ) {
        showSnackbar("error", responseData?.message);
      } else if (response.status === 200) {
        showSnackbar("success", responseData?.message);
        navigate(`/profiles/${auth?.userId}`);
      } else {
        showSnackbar("error", "Unknown error.");
      }
    } catch (err) {
      showSnackbar("error", err.message);
    }
  }

  return (
    <Container maxWidth="xl" sx={{ textAlign: "center", position: "relative" }}>
      {auth?.userId == collectionInfo?.user?.userId && (
        <Button
          startIcon={<EditIcon />}
          variant="outlined"
          color="success"
          sx={{
            textTransform: "none",
            position: "absolute",
            top: "1rem",
            right: "1rem",
          }}
          size="small"
          onClick={handleClickOpen}
        >
          Edit
        </Button>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit collection</DialogTitle>
        <DialogContent>
          <TextField
            sx={{ mt: "1rem" }}
            fullWidth
            type="text"
            id="outlined-error-helper-text"
            label="Name"
            name="collectionName"
            size="small"
            value={inputs.collectionName}
            onChange={handleChange}
          />
          <TextField
            sx={{ mt: "1rem" }}
            multiline
            fullWidth
            rows={2}
            type="text"
            id="outlined-error-helper-text"
            label="Description"
            name="description"
            size="small"
            value={inputs.description}
            onChange={handleChange}
          />
          <FormGroup sx={{ mt: "1rem" }}>
            <FormControlLabel
              control={
                <Checkbox
                  color="success"
                  checked={inputs.isPrivate}
                  onChange={(e) =>
                    setInputs((inputs) => ({
                      ...inputs,
                      isPrivate: e.target.checked,
                    }))
                  }
                />
              }
              label={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span>Make collection private</span>&nbsp;
                  <LockIcon fontSize="small" />
                </div>
              }
            />
          </FormGroup>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between" }}>
          <ConfirmDeleteDialog
            buttonText="Delete collection"
            title="Delete collection"
            content="Are you sure you want to delete this collection?"
            onConfirm={() => deleteCollectionAsync(collectionId)}
          />
          <Button
            onClick={() => updateCollectionAsync(collectionId)}
            variant="contained"
            color="success"
            sx={{ textTransform: "none" }}
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        {collectionInfo?.isPrivate && <LockIcon fontSize="large" />}
        <h1>{collectionInfo?.collectionName}</h1>
      </div>

      <p>{collectionInfo?.description}</p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          color: "gray",
          justifyContent: "center",
          marginBottom: "2rem",
        }}
      >
        <span style={{ fontStyle: "italic" }}>
          {photos?.length} photos collected by{" "}
        </span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
          }}
          onClick={() => navigate(`/profiles/${collectionInfo?.user?.userId}`)}
        >
          <Avatar
            alt=""
            src={collectionInfo?.user?.avatarUrl}
            sx={{ width: 32, height: 32 }}
          />
          <span>
            {collectionInfo?.user?.firstName} {collectionInfo?.user?.lastName}
          </span>
        </span>
      </div>

      <CircularProgressWithText loading={loading}>
        <ImageGallery photos={photos} />
      </CircularProgressWithText>
    </Container>
  );
}

export default Collection;
