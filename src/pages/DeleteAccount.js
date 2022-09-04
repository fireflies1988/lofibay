import { Alert, Button, Paper } from "@mui/material";
import React from "react";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";

function DeleteAccount() {
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
        />
      </Paper>
    </>
  );
}

export default DeleteAccount;
