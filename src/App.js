import { useContext, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import GlobalStyles from "./components/styles/Global";
import AuthContext from "./context/AuthProvider";
import Account from "./pages/Account";
import ChangePassword from "./pages/ChangePassword";
import DeleteAccount from "./pages/DeleteAccount";
import EditProfile from "./pages/EditProfile";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";

const theme = {
  colors: {
    brandLightColor: "#0fff4c",
    brandDarkColor: "#00ab4b",
  },
};

function App() {
  const { auth, setAuth } = useContext(AuthContext);
  // const loggedIn = useMemo(
  //   () => JSON.parse(localStorage.getItem("auth"))?.loggedIn
  // );

  useEffect(() => {
    let authData = localStorage.getItem("auth");
    if (authData !== null) {
      setAuth(JSON.parse(authData));
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          {auth?.accessToken === null && (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </>
          )}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            {auth?.accessToken !== null && (
              <Route path="account" element={<Account />}>
                <Route index element={<EditProfile />} />
                <Route path="password" element={<ChangePassword />} />
                <Route path="delete" element={<DeleteAccount />} />
                <Route path="*" element={<Navigate to="/account" />} />
              </Route>
            )}
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
