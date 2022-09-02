import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
} from "@mui/material";
import React, { useContext, useState } from "react";
import StyledFormHelperErrorText from "../components/StyledFormHelperErrorText";
import SaveIcon from "@mui/icons-material/Save";
import { fetchWithCredentialsAsync } from "../utils/Utils";
import {
  PATCH_WITH_AUTH_CHANGE_PASSWORD_ENDPOINT_PATH,
  SERVER_URL,
} from "../utils/Endpoints";
import AuthContext from "../context/AuthProvider";

const initialMessages = {
  currentPasswordErrorText: "",
  newPasswordErrorText: "",
  confirmNewPasswordErrorText: "",
  errorMessage: "",
  successMessage: "",
};

function ChangePassword() {
  const { auth, setAuth } = useContext(AuthContext); 
  const [inputs, setInputs] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [state, setState] = useState({
    showPassword: false,
    isUpdating: false,
  });
  const [messsages, setMessages] = useState(initialMessages);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessages(initialMessages);

    let errors = 0;
    if (!inputs.currentPassword) {
      setMessages((messages) => ({
        ...messages,
        currentPasswordErrorText: "The current password field is required!",
      }));
      errors++;
    }

    if (!inputs.newPassword) {
      setMessages((messages) => ({
        ...messages,
        newPasswordErrorText: "The new password field is required!",
      }));
      errors++;
    }

    if (!inputs.confirmNewPassword) {
      setMessages((messages) => ({
        ...messages,
        confirmPasswordErrorText: "The confirm new password field is required!",
      }));
      errors++;
    }

    if (inputs.newPassword !== inputs.confirmNewPassword) {
      setMessages((messages) => ({
        ...messages,
        errorMessage: "The new password and confirm new password do not match!",
      }));
      errors++;
    }

    if (errors === 0) {
      await changePasswordAsync();
    }
  }

  async function changePasswordAsync() {
    setState((state) => ({
      ...state,
      isUpdating: true,
    }));

    try {
      const requestOptions = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: inputs.currentPassword,
          newPassword: inputs.newPassword,
          confirmNewPassword: inputs.confirmNewPassword,
        }),
        redirect: "follow",
      };

      const changePasswordResponse = await fetchWithCredentialsAsync(
        `${SERVER_URL}${PATCH_WITH_AUTH_CHANGE_PASSWORD_ENDPOINT_PATH}`,
        requestOptions,
        setAuth
      );
      const changePasswordResponseData = await changePasswordResponse.json();

      if (changePasswordResponse.status === 400) {
        setMessages((messages) => ({ ...messages, errorMessage: JSON.stringify(changePasswordResponseData?.errors) }));
      } else if (changePasswordResponse.status === 422) {
        setMessages((messages) => ({ ...messages, errorMessage: changePasswordResponseData?.message }));
      } else if (changePasswordResponse.status === 200) {
        setMessages((messages) => ({ ...messages, successMessage: changePasswordResponseData?.message }));
      } else {
        setMessages((messages) => ({ ...messages, errorMessage: "Unknown error." }));
      }
    } catch (error) {
      setMessages((messages) => ({ ...messages, errorMessage: error.message }));
    }

    setState((state) => ({
      ...state,
      isUpdating: false,
    }));
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setInputs({ ...inputs, [name]: value });
  }

  function handleCancel() {}

  function handleClickShowPassword() {
    setState({ ...state, showPassword: !state.showPassword });
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <h2>Change password</h2>
      <Paper variant="outlined" sx={{ padding: "0.75rem" }}>
        {messsages.errorMessage !== "" && (
          <Alert variant="standard" severity="error">
            {messsages.errorMessage}
          </Alert>
        )}

        {messsages.successMessage !== "" && (
          <Alert variant="standard" severity="success">
            {messsages.successMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <FormControl
            sx={{ width: "25ch" }}
            variant="outlined"
            style={{ width: "100%", marginTop: "1rem" }}
            size="small"
          >
            <InputLabel htmlFor="outlined-adornment-password">
              Current password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={state.showPassword ? "text" : "password"}
              name="currentPassword"
              value={messsages.currentPassword}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {state.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Current password"
            />
          </FormControl>
          <StyledFormHelperErrorText>
            {messsages.currentPasswordErrorText}
          </StyledFormHelperErrorText>

          <FormControl
            sx={{ width: "25ch" }}
            variant="outlined"
            style={{ width: "100%", marginTop: "1rem" }}
            size="small"
          >
            <InputLabel htmlFor="outlined-adornment-password">
              New password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={state.showPassword ? "text" : "password"}
              name="newPassword"
              value={messsages.newPassword}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {state.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="New password"
            />
          </FormControl>
          <StyledFormHelperErrorText>
            {messsages.newPasswordErrorText}
          </StyledFormHelperErrorText>

          <FormControl
            sx={{ width: "25ch" }}
            variant="outlined"
            style={{ width: "100%", marginTop: "1rem" }}
            size="small"
          >
            <InputLabel htmlFor="outlined-adornment-password">
              Confirm new password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={state.showPassword ? "text" : "password"}
              name="confirmNewPassword"
              value={messsages.confirmNewPassword}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {state.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Confirm new password"
            />
          </FormControl>
          <StyledFormHelperErrorText>
            {messsages.confirmNewPasswordErrorText}
          </StyledFormHelperErrorText>

          <LoadingButton
            loading={state.isUpdating}
            loadingPosition="start"
            variant="contained"
            style={{ marginTop: "2rem", marginRight: "1rem" }}
            color="success"
            startIcon={<SaveIcon />}
            type="submit"
          >
            Change password
          </LoadingButton>

          <Button
            variant="outlined"
            color="success"
            style={{ marginTop: "2rem" }}
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </form>
      </Paper>
    </>
  );
}

export default ChangePassword;
