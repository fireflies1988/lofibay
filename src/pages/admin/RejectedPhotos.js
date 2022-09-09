import { Button, TableCell, TableRow } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PhotoReviewTable from "../../components/PhotoReviewTable";
import useFetch from "../../hooks/useFetch";
import { PhotoStates } from "../../utils/Constants";

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

function RejectedPhotos() {
  const [sortBy, setSortBy] = useState("uploadedat");
  const [desc, setDesc] = useState(false);
  const { fetchAdminPhotosAsync, updateAdminPhotoStateAsync } = useFetch();
  const [rejectedPhotos, setRejectedPhotos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminPhotosAsync(PhotoStates.Rejected, sortBy, desc, setRejectedPhotos);
  }, [sortBy, desc]);

  async function handleClickFeature(photoId) {
    await updateAdminPhotoStateAsync(photoId, PhotoStates.Featured);
    await fetchAdminPhotosAsync(PhotoStates.Rejected, sortBy, desc, setRejectedPhotos);
  }

  return (
    <>
      <h2>Rejected photos</h2>
      <PhotoReviewTable
        sortBy={sortBy}
        setSortBy={setSortBy}
        desc={desc}
        setDesc={setDesc}
        sortByItems={sortByItems}
      >
        {rejectedPhotos?.length > 0 &&
          rejectedPhotos.map((item) => (
            <TableRow
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
                <Button
                  variant="outlined"
                  color="success"
                  sx={{ textTransform: "none", ml: "0.5rem" }}
                  size="small"
                  onClick={() => handleClickFeature(item?.photoId)}
                >
                  Feature
                </Button>
              </TableCell>
            </TableRow>
          ))}
      </PhotoReviewTable>
    </>
  );
}

export default RejectedPhotos;
