import { Button, Paper, TextField, Typography } from "@mui/material";
import React from "react";

function VerifyEmail() {
  return (
    <>
      <h2>Verify your email</h2>
      <Paper variant="outlined" sx={{ padding: "0.75rem" }}>
        <Button
          variant="outlined"
          color="success"
          style={{ marginTop: "1rem", textTransform: "none" }}
        >
          Resend verification code
        </Button>

        <Typography sx={{ mt: "1rem" }}>
          We have sent you an email with a verification code, please check the
          mail inbox, copy the code then enter the code here (the code is only valid for 5 minutes).
        </Typography>

        <TextField
          style={{ width: "100%", marginTop: "1rem" }}
          type="text"
          id="outlined-error-helper-text"
          label="Verification code"
          name="code"
          size="small"
        />

        <Button
          variant="contained"
          color="success"
          style={{ marginTop: "1rem", textTransform: "none" }}
        >
          Verify
        </Button>
      </Paper>
    </>
  );
}

export default VerifyEmail;
