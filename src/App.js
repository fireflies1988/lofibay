import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import { useContext, useEffect, useMemo } from "react";
import AuthContext from "./context/AuthProvider";
import Layout from "./pages/Layout";
import { ThemeProvider } from "styled-components";
import GlobalStyles from "./components/styles/Global";
import Home from "./pages/Home";
import EditProfile from "./pages/EditProfile";
import ChangePassword from "./pages/ChangePassword";
import DeleteAccount from "./pages/DeleteAccount";

const theme = {
  colors: {
    brandLightColor: "#0fff4c",
    brandDarkColor: "#00ab4b"
  }
};

function App() {
  const { auth, setAuth } = useContext(AuthContext);
  const loggedIn = useMemo(
    () => JSON.parse(localStorage.getItem("auth"))?.loggedIn
  );

  useEffect(() => {
    let temp = localStorage.getItem("auth");
    if (temp != null) {
      setAuth(JSON.parse(temp));
    }
    console.log(auth);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="account" element={<Account />}>
              <Route index element={<EditProfile />} />
              <Route path="password" element={<ChangePassword />} />
              <Route path="delete" element={<DeleteAccount />} />
            </Route>
          </Route>

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
