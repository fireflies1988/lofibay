import LockIcon from "@mui/icons-material/Lock";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
} from "@mui/material";
import { Stack } from "@mui/system";
import React, { useContext, useState } from "react";
import YourCollectionsContext from "../contexts/YourCollectionsProvider";
import useFetch from "../hooks/useFetch";
import useNotistack from "../hooks/useNotistack";
import {
  POST_WITH_AUTH_CREATE_NEW_COLLECTION_ENPOINT_PATH,
  SERVER_URL,
} from "../utils/Endpoints";
import CheckboxLabel from "./CheckboxLabel";
import CollectionCard from "./CollectionCard";
import { RightColumnOfAddToDialog } from "./styles/Collection.styled";

function AddToCollectionDialog({ open, onClose, photoId, photoUrl }) {
  const [createDialogOpened, setCreateDialogOpened] = useState(false);
  const [inputs, setInputs] = useState({
    collectionName: "",
    description: "",
    isPrivate: false,
  });
  const { showSnackbar } = useNotistack();
  const { fetchWithCredentialsAsync, fetchYourCollectionsAsync } = useFetch();
  const { yourCollections, setYourCollections } = useContext(
    YourCollectionsContext
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  }

  function handleCancel(event) {
    setInputs({
      collectionName: "",
      description: "",
      isPrivate: false,
    });
    setCreateDialogOpened(false);
  }

  async function handleCreate(event) {
    if (!inputs.collectionName) {
      showSnackbar("error", "The Name field is required.");
    } else {
      await createNewCollectionAsync(photoId);
      await fetchYourCollectionsAsync(setYourCollections);
      setCreateDialogOpened(false);
    }
  }

  async function createNewCollectionAsync(photoId) {
    try {
      const response = await fetchWithCredentialsAsync(
        `${SERVER_URL}${POST_WITH_AUTH_CREATE_NEW_COLLECTION_ENPOINT_PATH}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow",
          body: JSON.stringify({
            ...inputs,
            photoId: photoId,
          }),
        }
      );
      const responseData = await response.json();

      if (response.status === 200) {
        fetchYourCollectionsAsync(setYourCollections);
        setCreateDialogOpened(false);
      } else if (response.status === 422) {
        showSnackbar("error", responseData?.message);
      } else {
        showSnackbar("error", "Unknown error.");
      }
    } catch (err) {
      showSnackbar("error", err.message);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth="md"
    >
      <DialogContent>
        <Grid container spacing={4}>
          <Grid item xs={5} sx={{ height: "550px" }}>
            <img
              src={photoUrl}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Grid>
          <Grid item xs={7} sx={{ height: "550px" }}>
            <RightColumnOfAddToDialog>
              <div className="title">Add to collection</div>
              <Stack spacing={2} sx={{ mt: "2rem" }}>
                <Box
                  component="span"
                  sx={{
                    border: "2px dashed grey",
                    height: "80px",
                    backgroundColor: "#eae6e673",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "1rem",
                    fontSize: "20px",
                    cursor: "pointer",
                  }}
                  onClick={() => setCreateDialogOpened(true)}
                >
                  Create a new collection
                </Box>
                <Dialog
                  open={createDialogOpened}
                  onClose={() => setCreateDialogOpened(false)}
                >
                  <DialogTitle>Create new collection</DialogTitle>
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
                    <CheckboxLabel
                      sx={{ mt: "1rem" }}
                      checked={inputs.isPrivate}
                      onChange={(e) =>
                        setInputs((inputs) => ({
                          ...inputs,
                          isPrivate: e.target.checked,
                        }))
                      }
                      label={
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span>Make collection private</span>&nbsp;
                          <LockIcon fontSize="small" />
                        </div>
                      }
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button
                      variant="outlined"
                      color="success"
                      sx={{ textTransform: "none" }}
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      sx={{ textTransform: "none" }}
                      onClick={handleCreate}
                    >
                      Create
                    </Button>
                  </DialogActions>
                </Dialog>

                {yourCollections?.length > 0 &&
                  yourCollections.map((item) => (
                    <CollectionCard
                      key={item?.collectionId}
                      collection={item}
                      photoId={photoId}
                    />
                  ))}
              </Stack>
            </RightColumnOfAddToDialog>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default AddToCollectionDialog;
