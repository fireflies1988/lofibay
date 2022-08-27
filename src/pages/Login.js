import LoginIcon from "@mui/icons-material/Login";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Alert,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { createBrowserHistory } from "history";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import StyledFormHelperErrorText from "../components/StyledFormHelperErrorText";
import { LoginContainer } from "../components/styles/Login.styled";
import AuthContext from "../context/AuthProvider";
import {
  GET_WITH_AUTH_USER_INFO_ENDPOINT_PATH,
  POST_LOGIN_ENDPOINT_PATH,
  SERVER_URL,
} from "../utils/Api";

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
    isLoading: false,
  });
  const initialMessages = {
    emailErrorText: "",
    passwordErrorText: "",
    errorMessage: "",
    successMessage: location.state?.message,
  };
  const [messages, setMessages] = useState(initialMessages);

  useEffect(() => {
    if (location.state) {
      history.replace(location.state, null);
    }
  }, []);

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

  async function handleSubmit(event) {
    event.preventDefault();
    setMessages(initialMessages);

    let errors = 0;
    if (!credentials.email) {
      setMessages((messages) => ({
        ...messages,
        emailErrorText: "Invalid email!",
      }));
      errors++;
    }

    if (!credentials.password) {
      setMessages((messages) => ({
        ...messages,
        passwordErrorText: "Password required!",
      }));
      errors++;
    }

    if (errors === 0) {
      await loginAsync(credentials.email, credentials.password);
    }
  }

  async function loginAsync(email, password) {
    setState((state) => ({
      ...state,
      isLoading: true,
    }));

    try {
      const loginResponse = await fetch(
        `${SERVER_URL}${POST_LOGIN_ENDPOINT_PATH}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
          redirect: "follow",
        }
      );
      const loginResponseData = await loginResponse.json();

      if (loginResponse.status === 200) {
        let authData = {
          accessToken: loginResponseData?.data?.accessToken,
          refreshToken: loginResponseData?.data?.refreshToken,
        };

        // fetch user info
        try {
          const userInfoResponse = await fetch(
            `${SERVER_URL}${GET_WITH_AUTH_USER_INFO_ENDPOINT_PATH}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `bearer ${authData.accessToken}`,
              },
              redirect: "follow",
            }
          );
          const userInfoResponseData = await userInfoResponse.json();

          if (userInfoResponse.status === 200) {
            authData = {
              ...authData,
              userId: userInfoResponseData?.data?.userId,
              avatarUrl: userInfoResponseData?.data?.avatarUrl,
              role: userInfoResponseData?.data?.role?.roleName,
            };
          }
        } catch (err) {
          console.log();
        }

        // save auth to local storage
        localStorage.setItem("auth", JSON.stringify(authData));
        setAuth(authData);
      } else if (loginResponse?.status === 401) {
        setMessages((messages) => ({
          ...messages,
          errorMessage: loginResponseData?.message,
        }));
      } else {
        setMessages((messages) => ({
          ...messages,
          errorMessage: "Unknown error.",
        }));
      }
    } catch (err) {
      setMessages((messages) => ({ ...messages, errorMessage: err.message }));
    }

    setState((state) => ({
      ...state,
      isLoading: false,
    }));
  }

  return (
    <LoginContainer>
      <form onSubmit={handleSubmit}>
        <Link to="/">
          <h1 className="title">Lofibay</h1>
        </Link>

        {messages.errorMessage !== "" && (
          <Alert variant="standard" severity="error">
            {messages.errorMessage}
          </Alert>
        )}
        {messages.successMessage && (
          <Alert variant="standard" severity="success">
            {messages.successMessage}
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
        <StyledFormHelperErrorText>
          {messages.emailErrorText}
        </StyledFormHelperErrorText>

        <FormControl
          sx={{ width: "25ch" }}
          variant="outlined"
          style={{ width: "100%", marginTop: "1rem" }}
        >
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
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
        <StyledFormHelperErrorText>
          {messages.passwordErrorText}
        </StyledFormHelperErrorText>

        <div className="forgot-password">
          <Link to="/">Forgot password?</Link>
        </div>

        <LoadingButton
          loading={state.isLoading}
          loadingPosition="start"
          startIcon={<LoginIcon />}
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
