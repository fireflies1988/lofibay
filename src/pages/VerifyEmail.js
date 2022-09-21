import { Alert, Button, Paper, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import useNotistack from "../hooks/useNotistack";
import {
  GET_WITH_AUTH_USER_INFO_ENDPOINT_PATH,
  POST_WITH_AUTH_RESEND_VERIFICATION_CODE_ENDPOINT_PATH,
  POST_WITH_AUTH_VERIFY_YOUR_EMAIL_ENDPOINT_PATH
} from "../utils/Endpoints";
import { headers } from "../utils/Utils";

function VerifyEmail() {
  const { showSnackbar } = useNotistack();
  const { fetchWithCredentialsAsync } = useFetch();
  const [userInfo, setUserInfo] = useState({});
  const [code, setCode] = useState();

  useEffect(() => {
    fetchUserInfoAsync();
  }, []);

  async function resendVerificationCodeAsync() {
    try {
      const response = await fetchWithCredentialsAsync(
        `${process.env.REACT_APP_SERVER_URL}${POST_WITH_AUTH_RESEND_VERIFICATION_CODE_ENDPOINT_PATH}`,
        {
          method: "POST",
          headers: headers(),
          redirect: "follow",
        }
      );
      const responseData = await response.json();

      if (response.status === 200) {
        showSnackbar("success", "Request verification code email sent, please check your mail inbox.");
      } else if (response.status === 422 || response.status === 500) {
        showSnackbar("error", responseData?.message);
      } else {
        showSnackbar("error", "Unkown error.");
      }
    } catch (err) {
      showSnackbar("error", err.message);
    }
  }

  async function verifyAsync() {
    try {
      const response = await fetchWithCredentialsAsync(
        `${process.env.REACT_APP_SERVER_URL}${POST_WITH_AUTH_VERIFY_YOUR_EMAIL_ENDPOINT_PATH}`,
        {
          method: "POST",
          headers: headers(),
          redirect: "follow",
          body: JSON.stringify({
            verificationCode: code
          }),
        }
      );
      const responseData = await response.json();

      if (response.status === 200) {
        showSnackbar("success", responseData?.message);
        await fetchUserInfoAsync();
      } else if (response.status === 422) {
        showSnackbar("error", responseData?.message);
      } else {
        showSnackbar("error", "Unkown error.");
      }
    } catch (err) {
      showSnackbar("error", err.message);
    }
  }

  async function fetchUserInfoAsync() {
    try {
      const userInfoResponse = await fetchWithCredentialsAsync(
        `${process.env.REACT_APP_SERVER_URL}${GET_WITH_AUTH_USER_INFO_ENDPOINT_PATH}`,
        {
          method: "GET",
          headers: headers(),
          redirect: "follow",
        }
      );
      const userInfoResponseData = await userInfoResponse.json();

      if (userInfoResponse.status === 200) {
        setUserInfo(userInfoResponseData?.data);
      } else {
        showSnackbar("error", "Unkown error.");
      }
    } catch (err) {
      showSnackbar("error", err.message);
    }
  }

  return (
    <>
      <h2>Verify your email</h2>
      <Paper variant="outlined" sx={{ padding: "0.75rem" }}>
        {userInfo?.verified ? (
          <Alert severity="success">Your account is already verified.</Alert>
        ) : (
          <>
            <Alert severity="error">Your account is not verified yet.</Alert>

            <Button
              variant="outlined"
              color="success"
              style={{ marginTop: "1rem", textTransform: "none" }}
              onClick={resendVerificationCodeAsync}
            >
              Resend verification code
            </Button>

            <Typography color sx={{ mt: "1rem" }}>
              We have sent you an email with a verification code, please check
              the mail inbox, copy the code then enter the code here (the code
              is only valid for 5 minutes).
            </Typography>

            <TextField
              style={{ width: "100%", marginTop: "1rem" }}
              type="text"
              id="outlined-error-helper-text"
              label="Verification code"
              name="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              size="small"
            />

            <Button
              variant="contained"
              color="success"
              style={{ marginTop: "1rem", textTransform: "none" }}
              onClick={verifyAsync}
            >
              Verify
            </Button>
          </>
        )}
      </Paper>
    </>
  );
}

export default VerifyEmail;
