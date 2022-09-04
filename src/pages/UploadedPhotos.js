import { Button, TableCell, TableRow } from "@mui/material";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PhotoReviewTable from "../components/PhotoReviewTable";
import AuthContext from "../contexts/AuthProvider";
import useFetch from "../hooks/useFetch";
import { PhotoStates } from "../utils/Constants";

const sortByItems = [
  {
    name: "Upload date",
    value: "uploadedat",
  },
  {
    name: "Faces detected",
    value: "facesdetected",
  },
];

function UploadedPhotos() {
  const { auth } = useContext(AuthContext);
  const [sortBy, setSortBy] = useState("uploadedat");
  const [desc, setDesc] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const { fetchAdminPhotosAsync, updateAdminPhotoStateAsync } = useFetch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminPhotosAsync(PhotoStates.NotReviewed, sortBy, desc, setUploadedPhotos);
  }, [sortBy, desc, auth]);

  async function handleClickFeature(photoId) {
    await updateAdminPhotoStateAsync(photoId, PhotoStates.Featured);
    await fetchAdminPhotosAsync(PhotoStates.NotReviewed, sortBy, desc, setUploadedPhotos);
  }

  async function handleClickReject(photoId) {
    await updateAdminPhotoStateAsync(photoId, PhotoStates.Rejected);
    await fetchAdminPhotosAsync(PhotoStates.NotReviewed, sortBy, desc, setUploadedPhotos);
  }

  return (
    <>
      <h2>Uploaded photos</h2>
      <PhotoReviewTable
        sortBy={sortBy}
        setSortBy={setSortBy}
        desc={desc}
        setDesc={setDesc}
        sortByItems={sortByItems}
      >
        {uploadedPhotos?.length > 0 &&
          uploadedPhotos.map((item) => (
            <TableRow
              key={item?.photoId}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <img
                  src={item?.photoUrl}
                  style={{ maxHeight: "250px" }}
                  alt=""
                />
              </TableCell>

              <TableCell align="right">
                {moment(item?.uploadedAt).format("L")}
              </TableCell>

              <TableCell align="right">
                {item?.width} x {item?.height}
              </TableCell>

              <TableCell align="right">{item?.facesDetected}</TableCell>

              <TableCell align="right">
                <Button
                  variant="outlined"
                  color="success"
                  sx={{ textTransform: "none" }}
                  size="small"
                  onClick={() => navigate(`/photos/${item?.photoId}`)}
                >
                  View
                </Button>
              </TableCell>

              <TableCell align="right">
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    flexDirection: "column",
                  }}
                >
                  <Button
                    variant="outlined"
                    color="success"
                    sx={{ textTransform: "none" }}
                    size="small"
                    onClick={() => handleClickFeature(item?.photoId)}
                  >
                    Feature
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{ textTransform: "none" }}
                    size="small"
                    onClick={() => handleClickReject(item?.photoId)}
                  >
                    Reject
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
      </PhotoReviewTable>
    </>
  );
}

export default UploadedPhotos;
