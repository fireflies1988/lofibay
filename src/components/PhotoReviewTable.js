import {
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import React, { useState } from "react";

function PhotoReviewTable({
  sortBy,
  setSortBy,
  desc,
  setDesc,
  sortByItems,
  children,
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper variant="outlined" sx={{ padding: "0.75rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="demo-select-small">Sort by</InputLabel>
          <Select
            labelId="demo-select-small"
            id="demo-select-small"
            value={sortBy}
            label="Sort by"
            onChange={(e) => setSortBy(e.target.value)}
          >
            {sortByItems?.length > 0 &&
              sortByItems?.map((item, index) => (
                <MenuItem value={item?.value} key={index}>
                  {item?.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <FormControl>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          >
            <FormControlLabel
              value={false}
              control={<Radio color="success" />}
              label="Ascending"
            />
            <FormControlLabel
              value={true}
              control={<Radio color="success" />}
              label="Descending"
            />
          </RadioGroup>
        </FormControl>
      </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Photo</TableCell>
              <TableCell align="right">Uploaded at</TableCell>
              <TableCell align="right">Dimensions</TableCell>
              <TableCell align="right">Face(s) detected</TableCell>
              <TableCell align="right">Details</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{children}</TableBody>
          {/* <TableFooter>
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
              />
            </TableRow>
          </TableFooter> */}
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default PhotoReviewTable;
