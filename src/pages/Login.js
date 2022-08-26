import { useContext, useState } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
  Alert,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoadingButton from "@mui/lab/LoadingButton";
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import { createBrowserHistory } from "history";
import axios from "axios";
import { LoginContainer } from "../components/styles/Login.styled";
import StyledFormHelperErrorText from "../components/StyledFormHelperErrorText";

function Login() {
  const history = createBrowserHistory();
  const location = useLocation();
  const { setAuth } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({
    email: location.state?.email,
    password: location.state?.password,
  });
  const [state, setState] = useState({
    showPassword: false,
    emailErrorText: "",
    passwordErrorText: "",
    errorMessage: "",
    successMessage: location.state?.message,
    isLoading: false,
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setCredentials({ ...credentials, [name]: value });
  }

  function handleClickShowPassword() {
    setState({ ...state, showPassword: !state.showPassword });
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  function handleSubmit(event) {
    event.preventDefault();
    setState((state) => ({
      ...state,
      emailErrorText: "",
      passwordErrorText: "",
      errorMessage: "",
      successMessage: "",
    }));

    let errors = 0;
    if (!credentials.email) {
      setState((state) => ({
        ...state,
        emailErrorText: "Invalid email!",
      }));
      errors++;
    }

    if (!credentials.password) {
      setState((state) => ({
        ...state,
        passwordErrorText: "Password required!",
      }));
      errors++;
    }

    if (errors === 0) {
      login(credentials.email, credentials.password);
    }
  }

  async function login(email, password) {
    setState((state) => ({
      ...state,
      isLoading: true,
    }));
    try {
      const response = await axios.post(
        "https://salty-earth-78071.herokuapp.com/user/login",
        {
          email,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
          // withCredentials: true
        }
      );
      if (response.data.accessToken != null) {
        const accessToken = response.data.accessToken;
        const tokenType = response.data.tokenType;

        // get role
        try {
          const response = await axios.get(
            "https://salty-earth-78071.herokuapp.com/user/get",
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: tokenType + " " + accessToken,
              },
            }
          );
          var isAdmin = response.data?.roleid?.name === "Admin" ? true : false;
        } catch (err) {
          console.log(err);
        }

        let temp = {
          accessToken: accessToken,
          tokenType: tokenType,
          loggedIn: true,
          isAdmin: isAdmin ?? false,
        };
        console.log(temp);
        localStorage.setItem("auth", JSON.stringify(temp));
        setAuth(temp);
      } else {
        setState((state) => ({
          ...state,
          errorMessage: "Incorrect email or password!",
        }));
      }
    } catch (err) {
      setState((state) => ({ ...state, errorMessage: err }));
    }
    setState((state) => ({
      ...state,
      isLoading: false,
    }));
  }

  return (
    <LoginContainer>
      <form onSubmit={handleSubmit}>
        <Link to="/"><h1 className="title">Lofibay</h1></Link>

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

        <TextField
          style={{ width: "100%", marginTop: "1rem" }}
          type="email"
          id="outlined-error-helper-text"
          label="Email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
        />
        <StyledFormHelperErrorText>{state.emailErrorText}</StyledFormHelperErrorText>

        <FormControl
          sx={{ width: "25ch" }}
          variant="outlined"
          style={{ width: "100%", marginTop: "1rem" }}
        >
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            helperText={state.passwordErrorText}
            id="outlined-adornment-password"
            type={state.showPassword ? "text" : "password"}
            name="password"
            value={credentials.password}
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
            label="Password"
          />
        </FormControl>
        <StyledFormHelperErrorText>{state.passwordErrorText}</StyledFormHelperErrorText>

        <div className="forgot-password">
          <Link to="/">Forgot password?</Link>
        </div>

        <LoadingButton
          loading={state.isLoading}
          loadingPosition="start"
          variant="contained"
          style={{ width: "100%", marginTop: "2.5rem" }}
          color="success"
          size="large"
          type="submit"
        >
          LOGIN
        </LoadingButton>

        <div className="register">
          <span>Don't have an account?</span>
          <Link to="/register"> Register now</Link>
        </div>
      </form>
    </LoginContainer>
  );
}

export default Login;
