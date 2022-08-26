import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Alert, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import axios from "axios";
import { LoginContainer } from "../components/styles/Login.styled";
import StyledFormHelperErrorText from "../components/StyledFormHelperErrorText";

const initialErrors = {
  emailErrorText: "",
  usernameErrorText: "",
  passwordErrorText: "",
  confirmPasswordErrorText: "",
  firstNameErrorText: "",
  lastNameErrorText: "",
  errorMessage: "",
};

function Register() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: ""
  });
  const [state, setState] = useState({
    showPassword: false,
    isLoading: false,
  });
  const [errors, setErrors] = useState(initialErrors);

  console.log(errors);

  function handleChange(event) {
    const { name, value } = event.target;
    setInputs({ ...inputs, [name]: value });
  }

  function handleClickShowPassword() {
    setState({ ...state, showPassword: !state.showPassword });
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  async function register({ email, password, firstName, lastName }) {
    setState((state) => ({
      ...state,
      isLoading: true,
    }));
    try {
      const response = await axios.post(
        "https://salty-earth-78071.herokuapp.com/user/register",
        {
          email: email,
          password: password,
          firstname: firstName,
          lastname: lastName,
          avatar: null,
        },
        {
          headers: { "Content-Type": "application/json" },
          // withCredentials: true
        }
      );
      if (response.data.code === 1) {
        navigate("/login", {
          state: {
            email: email,
            password: password,
            message: "Đã đăng ký thành công, đăng nhập ngay"
          }
        });
      } else {
        setErrors((state) => ({
          ...state,
          errorMessage: response.data.message,
        }));
      }
    } catch (err) {
      setErrors((errors) => ({ ...errors, errorMessage: err }));
    }
    setState((state) => ({
      ...state,
      isLoading: false,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setErrors(initialErrors);

    let errors = 0;
    if (!inputs.email) {
      setErrors((errors) => ({
        ...errors,
        emailErrorText: "The email field is required!",
      }));
      errors++;
    }

    if (!inputs.username) {
      setErrors((errors) => ({
        ...errors,
        usernameErrorText: "The username field is required!",
      }));
      errors++;
    }

    if (!inputs.password) {
      setErrors((errors) => ({
        ...errors,
        passwordErrorText: "The password field is required!",
      }));
      errors++;
    }

    if (!inputs.confirmPassword) {
      setErrors((errors) => ({
        ...errors,
        confirmPasswordErrorText: "The confirm password field is required!",
      }));
      errors++;
    }

    if (!inputs.firstName.trim()) {
      setErrors((errors) => ({
        ...errors,
        firstNameErrorText: "The first name field is required!",
      }));
      errors++;
    }

    if (!inputs.lastName.trim()) {
      setErrors((errors) => ({
        ...errors,
        lastNameErrorText: "The last name field is required!",
      }));
      errors++;
    }

    if (errors === 0) {
      register(inputs);
    }
  }

  return (
    <LoginContainer>
      <form onSubmit={handleSubmit}>
        <Link to="/"><h1 className="title">Lofibay</h1></Link>

        {errors.errorMessage !== "" && (
          <Alert variant="standard" severity="error">
            {errors.errorMessage}
          </Alert>
        )}

        <TextField
          style={{ width: "100%", marginTop: "1rem" }}
          type="email"
          id="outlined-error-helper-text"
          label="Email"
          name="email"
          value={inputs.email}
          onChange={handleChange}
          size="small"
        />
        <StyledFormHelperErrorText>{errors.emailErrorText}</StyledFormHelperErrorText>

        <TextField
          style={{ width: "100%", marginTop: "1rem" }}
          type="text"
          id="outlined-error-helper-text"
          label="Username"
          name="username"
          value={inputs.username}
          onChange={handleChange}
          size="small"
        />
        <StyledFormHelperErrorText>{errors.usernameErrorText}</StyledFormHelperErrorText>

        <FormControl
          sx={{ width: "25ch" }}
          variant="outlined"
          style={{ width: "100%", marginTop: "1rem" }}
          size="small"
        >
          <InputLabel htmlFor="outlined-adornment-password" className="my-font">
            Password
          </InputLabel>
          <OutlinedInput
            helperText={errors.passwordErrorText}
            id="outlined-adornment-password"
            type={state.showPassword ? "text" : "password"}
            name="password"
            value={errors.password}
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
            label="Password"
          />
        </FormControl>
        <StyledFormHelperErrorText>{errors.passwordErrorText}</StyledFormHelperErrorText>

        <FormControl
          sx={{ width: "25ch" }}
          variant="outlined"
          style={{ width: "100%", marginTop: "1rem" }}
          size="small"
        >
          <InputLabel htmlFor="outlined-adornment-password">
            Confirm password
          </InputLabel>
          <OutlinedInput
            helperText={errors.passwordErrorText}
            id="outlined-adornment-password"
            type={state.showPassword ? "text" : "password"}
            name="confirmPassword"
            value={errors.confirmPassword}
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
            label="ConfirmPassword"
          />
        </FormControl>
        <StyledFormHelperErrorText>{errors.confirmPasswordErrorText}</StyledFormHelperErrorText>

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
        <StyledFormHelperErrorText>{errors.firstNameErrorText}</StyledFormHelperErrorText>

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
        <StyledFormHelperErrorText>{errors.lastNameErrorText}</StyledFormHelperErrorText>

        <LoadingButton
          loading={errors.isLoading}
          loadingPosition="start"
          variant="contained"
          style={{ width: "100%", marginTop: "2.5rem" }}
          color="success"
          size="large"
          type="submit"
        >
          REGISTER
        </LoadingButton>

        <div className="register">
          <span>Already have an account?</span>
          <Link to="/login"> Login</Link>
        </div>
      </form>
    </LoginContainer>
  );
}

export default Register;
