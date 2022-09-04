import LoginIcon from "@mui/icons-material/Login";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import { LinkStyles } from "../components/styles/Link.styled";
import { LoginContainer } from "../components/styles/Login.styled";
import AuthContext from "../contexts/AuthProvider";
import useNotistack from "../hooks/useNotistack";
import {
  GET_WITH_AUTH_USER_INFO_ENDPOINT_PATH,
  POST_FORGOT_PASSWORD_ENDPOINT_PATH,
  POST_LOGIN_ENDPOINT_PATH,
  SERVER_URL,
} from "../utils/Endpoints";
import { saveAuth } from "../utils/Utils";

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
  const [forgotPasswordDialogOpened, setForgotPasswordDialogOpened] = useState(false);
  const [requestEmail, setRequestEmail] = useState();
  const { showSnackbar } = useNotistack();

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
              username: userInfoResponseData?.data?.username,
            };
          }
        } catch (err) {
          showSnackbar("error", err.message);
        }

        // save auth to local storage
        console.log(authData);
        saveAuth(authData);
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

  async function handleRequestPasswordReset() {
    if (!requestEmail) {
      showSnackbar("error", "Request email is required.");
    } else {
      await forgotPasswordAsync();
    }
  }

  async function forgotPasswordAsync() {
    try {
      const response = await fetch(
        `${SERVER_URL}${POST_FORGOT_PASSWORD_ENDPOINT_PATH}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow",
          body: JSON.stringify({
            email: requestEmail
          }),
        }
      );
      const responseData = await response.json();

      if (response.status === 200) {
        showSnackbar("success", "A request password reset email was sent to your email. Please check your inbox and follow the instructions.");
      } else if (response.status === 422 || response.status === 500) {
        showSnackbar("error", responseData?.message);
      } else {
        showSnackbar("error", "Unkown error.");
      }
    } catch (err) {
      showSnackbar("error", err.message);
    }
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
          <LinkStyles
            style={{ fontWeight: "500" }}
            onClick={() => setForgotPasswordDialogOpened(true)}
          >
            Forgot password?
          </LinkStyles>
          <Dialog open={forgotPasswordDialogOpened} onClose={() => setForgotPasswordDialogOpened(false)} maxWidth="sm">
            <DialogTitle>Forgot your password?</DialogTitle>
            <DialogContent>
              <TextField
                sx={{ mt: "1rem" }}
                fullWidth
                type="email"
                id="outlined-error-helper-text"
                label="Email"
                name="requestEmail"
                size="small"
                value={requestEmail}
                onChange={(e) => setRequestEmail(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleRequestPasswordReset}
                variant="contained"
                color="success"
                sx={{ textTransform: "none" }}
                fullWidth
              >
                Request password reset
              </Button>
            </DialogActions>
          </Dialog>
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
