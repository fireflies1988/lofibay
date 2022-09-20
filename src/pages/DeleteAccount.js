import { Alert, Paper } from "@mui/material";
import React, { useContext } from "react";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";
import AuthContext from "../contexts/AuthProvider";
import useFetch from "../hooks/useFetch";
import useNotistack from "../hooks/useNotistack";
import {
  DELETE_WITH_AUTH_SOFT_DELETE_ACCOUNT_ENPOINT_PATH
} from "../utils/Endpoints";
import { headers, removeAuth } from "../utils/Utils";

function DeleteAccount() {
  const { setAuth } = useContext(AuthContext);
  const { fetchWithCredentialsAsync } = useFetch();
  const { showSnackbar } = useNotistack();

  async function softDeleteAccount() {
    try {
      const response = await fetchWithCredentialsAsync(
        `${process.env.REACT_APP_SERVER_URL}${DELETE_WITH_AUTH_SOFT_DELETE_ACCOUNT_ENPOINT_PATH}`,
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
        removeAuth();
        setAuth({
          accessToken: null,
          refreshToken: null,
          userId: null,
          avatarUrl: null,
          role: null,
          username: null,
        });
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
    <>
      <h2>Delete account</h2>
      <Paper variant="outlined" sx={{ padding: "0.75rem" }}>
        <Alert severity="error" sx={{ mb: "1rem" }}>
          Be careful, you can't undo this action here.
        </Alert>
        <ConfirmDeleteDialog
          buttonText="Delete my account"
          title="Delete my account"
          content="Are you sure you want to delete your account?"
          onConfirm={softDeleteAccount}
        />
      </Paper>
    </>
  );
}

export default DeleteAccount;
