import {
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import React from "react";
import FilterListIcon from "@mui/icons-material/FilterList";

function AdminDashboard() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  //   const emptyRows =
  //     page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <h2>Admin dashboard</h2>
      <Paper variant="outlined" sx={{ padding: "0.75rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>Photos need to be review</h3>
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </div>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Photo</TableCell>
                <TableCell align="right">Uploaded at</TableCell>
                <TableCell align="right">Face(s) detected</TableCell>
                <TableCell align="right">Detail</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <img
                    src="https://res.cloudinary.com/dsskvx9ha/image/upload/v1661163325/LofibayStorageTest/3/hry9vk5mzztps4jr75nv.jpg"
                    style={{ maxHeight: "250px" }}
                    alt=""
                  />
                </TableCell>
                <TableCell align="right">2022-08-23</TableCell>
                <TableCell align="right">1</TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    color="success"
                    sx={{ textTransform: "none" }}
                    size="small"
                  >
                    View
                  </Button>
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    color="success"
                    sx={{ textTransform: "none" }}
                    size="small"
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{ textTransform: "none", ml: "0.5rem" }}
                    size="small"
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>

              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <img
                    src="https://res.cloudinary.com/dsskvx9ha/image/upload/v1661163325/LofibayStorageTest/3/hry9vk5mzztps4jr75nv.jpg"
                    style={{ maxHeight: "250px" }}
                    alt=""
                  />
                </TableCell>
                <TableCell align="right">2022-08-23</TableCell>
                <TableCell align="right">1</TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    color="success"
                    sx={{ textTransform: "none" }}
                    size="small"
                  >
                    View
                  </Button>
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    color="success"
                    sx={{ textTransform: "none" }}
                    size="small"
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{ textTransform: "none", ml: "0.5rem" }}
                    size="small"
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>

              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <img
                    src="https://res.cloudinary.com/dsskvx9ha/image/upload/v1661163325/LofibayStorageTest/3/hry9vk5mzztps4jr75nv.jpg"
                    style={{ maxHeight: "250px" }}
                    alt=""
                  />
                </TableCell>
                <TableCell align="right">2022-08-23</TableCell>
                <TableCell align="right">1</TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    color="success"
                    sx={{ textTransform: "none" }}
                    size="small"
                  >
                    View
                  </Button>
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    color="success"
                    sx={{ textTransform: "none" }}
                    size="small"
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{ textTransform: "none", ml: "0.5rem" }}
                    size="small"
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>

              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <img
                    src="https://res.cloudinary.com/dsskvx9ha/image/upload/v1661163325/LofibayStorageTest/3/hry9vk5mzztps4jr75nv.jpg"
                    style={{ maxHeight: "250px" }}
                    alt=""
                  />
                </TableCell>
                <TableCell align="right">2022-08-23</TableCell>
                <TableCell align="right">1</TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    color="success"
                    sx={{ textTransform: "none" }}
                    size="small"
                  >
                    View
                  </Button>
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    color="success"
                    sx={{ textTransform: "none" }}
                    size="small"
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{ textTransform: "none", ml: "0.5rem" }}
                    size="small"
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>

              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <img
                    src="https://res.cloudinary.com/dsskvx9ha/image/upload/v1661163325/LofibayStorageTest/3/hry9vk5mzztps4jr75nv.jpg"
                    style={{ maxHeight: "250px" }}
                    alt=""
                  />
                </TableCell>
                <TableCell align="right">2022-08-23</TableCell>
                <TableCell align="right">1</TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    color="success"
                    sx={{ textTransform: "none" }}
                    size="small"
                  >
                    View
                  </Button>
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    color="success"
                    sx={{ textTransform: "none" }}
                    size="small"
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{ textTransform: "none", ml: "0.5rem" }}
                    size="small"
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={3}
                  count={100}
                  rowsPerPage={10}
                  page={1}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  //   ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}

export default AdminDashboard;
