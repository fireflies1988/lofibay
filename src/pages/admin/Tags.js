import SearchIcon from "@mui/icons-material/Search";
import {
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputBase,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CircularProgressWithText from "../../components/CircularProgressWithText";
import useFetch from "../../hooks/useFetch";
import useNotistack from "../../hooks/useNotistack";
import {
  DELETE_WITH_AUTH_TAG_BY_NAME_ENDPOINT_PATH,
  GET_WITH_AUTH_TAGS_ENDPOINT_PATH
} from "../../utils/Endpoints";
import { headers } from "../../utils/Utils";

function Tags() {
  const { fetchWithCredentialsAsync } = useFetch();
  const { showSnackbar } = useNotistack();
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [bad, setBad] = useState(false);

  useEffect(() => {
    fetchTagsAsync(keyword, bad);
  }, [keyword, bad]);

  async function fetchTagsAsync(keyword, bad) {
    setLoading(true);
    try {
      const response = await fetchWithCredentialsAsync(
        `${process.env.REACT_APP_SERVER_URL}${GET_WITH_AUTH_TAGS_ENDPOINT_PATH.replace(
          "{keyword}",
          keyword
        ).replace("{bad}", bad)}`,
        {
          method: "GET",
          headers: headers({
            "Content-Type": "application/json",
          }),
          redirect: "follow",
        }
      );
      const responseData = await response.json();

      if (response.status === 200) {
        setTags(responseData?.data);
      } else {
        showSnackbar("error", "Unknown error.");
      }
    } catch (err) {
      showSnackbar("error", err.message);
    }
    setLoading(false);
  }

  async function removeTagAsync(name) {
    try {
      const response = await fetchWithCredentialsAsync(
        `${process.env.REACT_APP_SERVER_URL}${DELETE_WITH_AUTH_TAG_BY_NAME_ENDPOINT_PATH.replace(
          "{name}",
          name
        )}`,
        {
          method: "DELETE",
          headers: headers({
            "Content-Type": "application/json",
          }),
          redirect: "follow",
        }
      );
      const responseData = await response.json();

      if (response.status === 200) {
        showSnackbar("success", responseData?.message);
        await fetchTagsAsync(keyword, bad);
      } else if (response.status === 400 || response.status === 422) {
        showSnackbar("error", responseData?.message);
      } else {
        showSnackbar("error", "Unknown error.");
      }
    } catch (err) {
      showSnackbar("error", err.message);
    }
  }

  return (
    <>
      <h2>Tags</h2>
      <Paper variant="outlined" sx={{ padding: "0.75rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Paper
            component="form"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: "400px",
              mb: "1rem",
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search tags"
              inputProps={{ "aria-label": "search google maps" }}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>

          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  color="success"
                  checked={bad}
                  onChange={(e) => setBad(e.target.checked)}
                />
              }
              label="Bad tags"
            />
          </FormGroup>
        </div>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="left">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <CircularProgressWithText loading={loading}>
                {tags?.length > 0 &&
                  tags?.map((item, index) => (
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      key={index}
                    >
                      <TableCell align="left">
                        <Chip label={item?.name} variant="Filled" />
                      </TableCell>
                      <TableCell align="left">
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          sx={{ textTransform: "none" }}
                          onClick={() => removeTagAsync(item?.name)}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </CircularProgressWithText>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}

export default Tags;
