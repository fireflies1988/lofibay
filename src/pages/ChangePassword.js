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
import React, { useState } from "react";
import StyledFormHelperErrorText from "../components/StyledFormHelperErrorText";
import SaveIcon from "@mui/icons-material/Save";

const initialErrors = {
  emailErrorText: "",
  usernameErrorText: "",
  passwordErrorText: "",
  confirmPasswordErrorText: "",
  firstNameErrorText: "",
  lastNameErrorText: "",
  errorMessage: "",
};

function ChangePassword() {
  const [inputs, setInputs] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [state, setState] = useState({
    showPassword: false,
    isLoading: false,
  });
  const [errors, setErrors] = useState(initialErrors);

  function handleSubmit() {}
  function handleChange() {}
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
        {errors.errorMessage !== "" && (
          <Alert variant="standard" severity="error">
            {errors.errorMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
        <FormControl
            sx={{ width: "25ch" }}
            variant="outlined"
            style={{ width: "100%", marginTop: "1rem" }}
            size="small"
          >
            <InputLabel
              htmlFor="outlined-adornment-password"
              className="my-font"
            >
              Current password
            </InputLabel>
            <OutlinedInput
              helperText={errors.currentPasswordErrorText}
              id="outlined-adornment-password"
              type={state.showPassword ? "text" : "password"}
              name="currentPassword"
              value={errors.currentPassword}
              onChange={handleChange}
              inputProps={{ className: "my-font" }}
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
            {errors.currentPasswordErrorText}
          </StyledFormHelperErrorText>

          <FormControl
            sx={{ width: "25ch" }}
            variant="outlined"
            style={{ width: "100%", marginTop: "1rem" }}
            size="small"
          >
            <InputLabel
              htmlFor="outlined-adornment-password"
              className="my-font"
            >
              New password
            </InputLabel>
            <OutlinedInput
              helperText={errors.newPasswordErrorText}
              id="outlined-adornment-password"
              type={state.showPassword ? "text" : "password"}
              name="newPassword"
              value={errors.newPassword}
              onChange={handleChange}
              inputProps={{ className: "my-font" }}
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
            {errors.newPasswordErrorText}
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
              helperText={errors.passwordErrorText}
              id="outlined-adornment-password"
              type={state.showPassword ? "text" : "password"}
              name="confirmNewPassword"
              value={errors.confirmNewPassword}
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
            {errors.confirmNewPasswordErrorText}
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
            className="my-font"
          >
            Cancel
          </Button>
        </form>
      </Paper>
    </>
  );
}

export default ChangePassword;
