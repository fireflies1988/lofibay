import { Button, TableCell, TableRow } from "@mui/material";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import PhotoReviewTable from "../../components/PhotoReviewTable";
import AuthContext from "../../contexts/AuthProvider";
import useFetch from "../../hooks/useFetch";

const sortByItems = [
  {
    name: "Upload date",
    value: "uploadedat",
  },
  {
    name: "Faces detected",
    value: "facesdetected",
  },
  {
    name: "Deleted date",
    value: "deleteddate",
  },
];

function DeletedPhotos() {
  const { auth } = useContext(AuthContext);
  const [sortBy, setSortBy] = useState("uploadedat");
  const [desc, setDesc] = useState(false);
  const { fetchAdminDeletedPhotosAsync } = useFetch();
  const [deletedPhotos, setDeletedPhotos] = useState([]);

  useEffect(() => {
    fetchAdminDeletedPhotosAsync(sortBy, desc, setDeletedPhotos);
  }, [sortBy, desc, auth]);

  return (
    <>
      <h2>Deleted photos</h2>
      <PhotoReviewTable
        sortBy={sortBy}
        setSortBy={setSortBy}
        desc={desc}
        setDesc={setDesc}
        sortByItems={sortByItems}
      >
        {deletedPhotos?.length > 0 &&
          deletedPhotos.map((item) => (
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

              <TableCell align="right"></TableCell>

              <TableCell align="right"></TableCell>
            </TableRow>
          ))}
      </PhotoReviewTable>
    </>
  );
}

export default DeletedPhotos;
