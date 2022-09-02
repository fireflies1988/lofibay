import SaveIcon from "@mui/icons-material/Save";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Avatar,
  Button, Paper,
  TextField
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React, { useContext, useEffect, useState } from "react";
import CircularProgressWithText from "../components/CircularProgressWithText";
import CountrySelect from "../components/CountrySelect";
import StyledFormHelperErrorText from "../components/StyledFormHelperErrorText";
import AuthContext from "../context/AuthProvider";
import {
  GET_WITH_AUTH_USER_INFO_ENDPOINT_PATH,
  PATCH_WITH_AUTH_UPDATE_USER_ENDPOINT_PATH,
  SERVER_URL
} from "../utils/Endpoints";
import {
  fetchWithCredentialsAsync,
  getAccessToken,
  saveAvatarUrl
} from "../utils/Utils";

function EditProfile() {
  const [initialInputs, setInitialInputs] = useState({});
  const { auth, setAuth } = useContext(AuthContext);
  const [inputs, setInputs] = useState({
    previewAvatarUrl: "",
    avatarFile: null,
    email: "",
    username: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phoneNumber: "",
    biography: "",
    city: "",
    country: "",
  });
  const [state, setState] = useState({
    firstNameErrorText: "",
    lastNameErrorText: "",
    errorMessage: "",
    successMessage: "",
    isLoading: true,
    isUpdating: false,
    loadingText: "Fetching data, please stand by...",
  });

  useEffect(() => {
    if (getAccessToken()) {
      fetchUserInfoAsync();
    }
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setInputs({ ...inputs, [name]: value });
  }

  async function handleSubmit(event) {
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
        firstNameErrorText: "The first name field is required!",
      }));
      errors++;
    }

    if (!inputs.lastName.trim()) {
      setState((state) => ({
        ...state,
        lastNameErrorText: "The last name field is required!",
      }));
      errors++;
    }

    if (errors === 0) {
      await updateUserInfoAsync();
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

  function showPreview(e) {
    setInputs((inputs) => ({
      ...inputs,
      previewAvatarUrl: URL.createObjectURL(e.target.files[0]),
      avatarFile: e.target.files[0],
    }));
  }

  async function fetchUserInfoAsync() {
    try {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
      };
      const userInfoResponse = await fetchWithCredentialsAsync(
        `${SERVER_URL}${GET_WITH_AUTH_USER_INFO_ENDPOINT_PATH}`,
        requestOptions,
        setAuth
      );
      const userInfoResponseData = await userInfoResponse.json();

      if (userInfoResponse.status === 200) {
        setInputs({
          avatarFile: null,
          previewAvatarUrl: userInfoResponseData?.data?.avatarUrl,
          email: userInfoResponseData?.data?.email,
          username: userInfoResponseData?.data?.username,
          firstName: userInfoResponseData?.data?.firstName,
          lastName: userInfoResponseData?.data?.lastName,
          dateOfBirth: userInfoResponseData?.data?.dateOfBirth,
          phoneNumber: userInfoResponseData?.data?.phoneNumber ?? "",
          biography: userInfoResponseData?.data?.biography ?? "",
          city: userInfoResponseData?.data?.address?.city ?? "",
          country: userInfoResponseData?.data?.address?.country ?? "",
        });

        setInitialInputs((inputs) => ({ ...inputs }));
      }
    } catch (err) {
      setState((state) => ({
        ...state,
        errorMessage:
          "Something went wrong, please try again later.\n" + err.message,
      }));
    }

    setState((state) => ({
      ...state,
      isLoading: false,
    }));
  }

  async function updateUserInfoAsync() {
    setState((state) => ({
      ...state,
      isUpdating: true,
      successMessage: "",
      errorMessage: "",
    }));

    try {
      const formData = new FormData();
      console.log(inputs);
      if (inputs.avatarFile) {
        formData.append("ImageFile", inputs.avatarFile);
      }
      formData.append("Email", "");
      formData.append("Username", "");
      formData.append("ImageFile", "");
      formData.append("Firstname", inputs.firstName);
      formData.append("Lastname", inputs.lastName);
      if (inputs.dateOfBirth) {
        formData.append("DateOfBirth", inputs.dateOfBirth);
      }
      if (inputs.phoneNumber) {
        formData.append("PhoneNumber", inputs.phoneNumber);
      }
      console.log(inputs.biography);
      formData.append("Biography", inputs.biography);
      formData.append("Address.Address", "");
      formData.append("Address.District", "");
      formData.append("Address.City", inputs.city);
      formData.append("Address.Province", "");
      formData.append("Address.State", "");
      formData.append("Address.Country", inputs.country);
      formData.append("GenderId", "");

      const requestOptions = {
        method: "PATCH",
        body: formData,
        redirect: "follow",
      };

      const updateUserInfoResponse = await fetchWithCredentialsAsync(
        `${SERVER_URL}${PATCH_WITH_AUTH_UPDATE_USER_ENDPOINT_PATH}`,
        requestOptions,
        setAuth
      );
      const updateUserInfoResponseData = await updateUserInfoResponse.json();

      if (updateUserInfoResponse.status === 400) {
        setState((state) => ({
          ...state,
          errorMessage: JSON.stringify(updateUserInfoResponseData?.errors),
        }));
      } else if (updateUserInfoResponse.status === 422) {
        setState((state) => ({
          ...state,
          errorMessage: updateUserInfoResponseData?.message,
        }));
      } else if (updateUserInfoResponse.status === 200) {
        saveAvatarUrl(updateUserInfoResponseData?.data?.avatarUrl);
        setAuth((auth) => ({
          ...auth,
          avatarUrl: updateUserInfoResponseData?.data?.avatarUrl,
        }));
        setState((state) => ({
          ...state,
          successMessage: updateUserInfoResponseData?.message,
        }));
      } else {
        setState((state) => ({
          ...state,
          errorMessage: "Unknown errors.",
        }));
      }
    } catch (err) {
      console.log(err);
      setState((state) => ({
        ...state,
        errorMessage: err.message,
      }));
    }

    setState((state) => ({
      ...state,
      isUpdating: false,
    }));
  }

  return (
    <>
      <h2>Edit profile</h2>
      <Paper variant="outlined" sx={{ padding: "0.75rem" }}>
        {state.errorMessage !== "" && (
          <Alert variant="standard" severity="error">
            {state.errorMessage}
          </Alert>
        )}
        {state.successMessage && (
          <Alert variant="standard" severity="success">
            {state.successMessage}
          </Alert>
        )}

        <CircularProgressWithText
          loading={state.isLoading}
          text={state.loadingText}
        >
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "1rem",
              }}
            >
              <Avatar
                alt="Remy Sharp"
                src={inputs.previewAvatarUrl}
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
              type="text"
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
                onChange={(newValue) =>
                  setInputs({ ...inputs, dateOfBirth: newValue })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    style={{ marginTop: "1rem" }}
                    size="small"
                  />
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

            <CountrySelect
              value={inputs.country}
              onChange={(event, value) =>
                setInputs((inputs) => ({ ...inputs, country: value }))
              }
            />

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
            >
              Cancel
            </Button>
          </form>
        </CircularProgressWithText>
      </Paper>
    </>
  );
}

export default EditProfile;
