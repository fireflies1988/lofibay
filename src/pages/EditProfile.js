import SaveIcon from "@mui/icons-material/Save";
import { LoadingButton } from "@mui/lab";
import { Avatar, Button, Paper, TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import React, { useContext, useState } from "react";
import StyledFormHelperErrorText from "../components/StyledFormHelperErrorText";
import AuthContext from "../context/AuthProvider";

function EditProfile() {
  const [previewAvatarUrl, setPreviewAvatarUrl] = useState();
  const [initialInputs, setInitialInputs] = useState({});
  const { auth } = useContext(AuthContext);
  const [inputs, setInputs] = useState({
    avatar: null,
    email: "",
    username: "",
    firstName: "",
    lastName: "",
    dateOfBirth: null,
    phoneNumber: null,
    biography: null,
    city: null,
    country: null
  });
  const [state, setState] = useState({
    firstNameErrorText: "",
    lastNameErrorText: "",
    errorMessage: "",
    successMessage: "",
    isLoading: true,
    isUpdating: false,
    loadingText: "Đang lấy dữ liệu, vui lòng chờ...",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setInputs({ ...inputs, [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setState((state) => ({
      ...state,
      firstNameErrorText: "",
      lastNameErrorText: "",
      errorMessage: "",
      successMessage: "",
    }));

    let errors = 0;
    if (!inputs.firstName.trim()) {
      setState((state) => ({
        ...state,
        firstNameErrorText: "Tên không được bỏ trống!",
      }));
      errors++;
    }

    if (!inputs.lastName.trim()) {
      setState((state) => ({
        ...state,
        lastNameErrorText: "Họ không được bỏ trống!",
      }));
      errors++;
    }

    if (errors === 0) {
      updateUserInfo(inputs);
    }
  }

  function handleCancel(event) {
    setState((state) => ({
      ...state,
      successMessage: "",
      errorMessage: "",
      firstNameErrorText: "",
      lastNameErrorText: "",
    }));
    setInputs(initialInputs);
  }

  async function updateUserInfo({ firstName, lastName, avatar }) {
    setState((state) => ({
      ...state,
      isUpdating: true,
      successMessage: "",
      errorMessage: "",
    }));
    try {
      const response = await axios.post(
        "https://salty-earth-78071.herokuapp.com/user/update",
        {
          firstname: firstName,
          lastname: lastName,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: auth.tokenType + " " + auth.accessToken,
          },
        }
      );
      setInputs(() => ({
        email: response.data.result.email,
        firstName: response.data.result.firstname,
        lastName: response.data.result.lastname,
        avatar: response.data.result.avatar,
      }));
      setInitialInputs(() => ({ ...inputs }));
      setState((state) => ({
        ...state,
        isUpdating: false,
        successMessage: "Cập nhật hồ sơ thành công",
      }));
    } catch (err) {
      setState((state) => ({
        ...state,
        errorMessage: err,
        isUpdating: false,
      }));
    }
  }

  function showPreview(e) {
    setPreviewAvatarUrl(URL.createObjectURL(e.target.files[0]));
  }

  return (
    <>
      <h2>Edit profile</h2>
      <Paper variant="outlined" sx={{ padding: "0.75rem" }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar
              alt="Remy Sharp"
              src={previewAvatarUrl}
              sx={{ width: 120, height: 120 }}
            />
            <Button
              variant="contained"
              component="label"
              color="success"
              sx={{ marginLeft: "1.25rem", textTransform: "none" }}
            >
              Change avatar
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={showPreview}
              />
            </Button>
          </div>

          <TextField
            style={{ width: "100%", marginTop: "1rem" }}
            type="email"
            id="outlined-error-helper-text"
            label="Email"
            name="email"
            value={inputs.email}
            onChange={handleChange}
            size="small"
            disabled
          />

          <TextField
            style={{ width: "100%", marginTop: "1rem" }}
            type="email"
            id="outlined-error-helper-text"
            label="Username"
            name="username"
            value={inputs.username}
            onChange={handleChange}
            size="small"
            disabled
          />

          <TextField
            style={{ width: "100%", marginTop: "1rem" }}
            type="text"
            id="outlined-error-helper-text"
            label="First name"
            name="firstName"
            value={inputs.firstName}
            onChange={handleChange}
            size="small"
          />
          <StyledFormHelperErrorText>
            {state.firstNameErrorText}
          </StyledFormHelperErrorText>

          <TextField
            style={{ width: "100%", marginTop: "1rem" }}
            type="text"
            id="outlined-error-helper-text"
            label="Last name"
            name="lastName"
            value={inputs.lastName}
            onChange={handleChange}
            size="small"
          />
          <StyledFormHelperErrorText>
            {state.lastNameErrorText}
          </StyledFormHelperErrorText>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Date of birth"
              inputFormat="MM/DD/YYYY"
              value={inputs.dateOfBirth}
              onChange={handleChange}
              renderInput={(params) => (
                <TextField {...params} style={{ marginTop: "1rem" }} size="small" />
              )}
            />
          </LocalizationProvider>

          <TextField
            style={{ width: "100%", marginTop: "1rem" }}
            type="text"
            id="outlined-error-helper-text"
            label="Phone number"
            name="phoneNumber"
            value={inputs.phoneNumber}
            onChange={handleChange}
            size="small"
          />
          <StyledFormHelperErrorText>
            {state.phoneNumberErrorText}
          </StyledFormHelperErrorText>

          <TextField
            style={{ width: "100%", marginTop: "1rem" }}
            type="text"
            id="outlined-error-helper-text"
            label="Biography"
            name="biography"
            value={inputs.biography}
            onChange={handleChange}
            size="small"
          />
          <StyledFormHelperErrorText>
            {state.biographyErrorText}
          </StyledFormHelperErrorText>

          <TextField
            style={{ width: "100%", marginTop: "1rem" }}
            type="text"
            id="outlined-error-helper-text"
            label="City"
            name="city"
            value={inputs.city}
            onChange={handleChange}
            size="small"
          />
          <StyledFormHelperErrorText>
            {state.cityErrorText}
          </StyledFormHelperErrorText>

          <TextField
            style={{ width: "100%", marginTop: "1rem" }}
            type="text"
            id="outlined-error-helper-text"
            label="Country"
            name="country"
            value={inputs.country}
            onChange={handleChange}
            size="small"
          />
          <StyledFormHelperErrorText>
            {state.countryErrorText}
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
            Update profile
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

export default EditProfile;
