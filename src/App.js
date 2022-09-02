import { useContext, useEffect, useMemo } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import GlobalStyles from "./components/styles/Global";
import AuthContext from "./context/AuthProvider";
import Account from "./pages/Account";
import AdminDashboard from "./pages/AdminDashboard";
import ChangePassword from "./pages/ChangePassword";
import Collection from "./pages/Collection";
import DeleteAccount from "./pages/DeleteAccount";
import EditProfile from "./pages/EditProfile";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import PhotoDetails from "./pages/PhotoDetails";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Upload from "./pages/Upload";
import VerifyEmail from "./pages/VerifyEmail";
import { getAccessToken, getAuth } from "./utils/Utils";

const theme = {
  colors: {
    brandLightColor: "#0fff4c",
    brandDarkColor: "#00ab4b",
  },
};

function App() {
  const { auth, setAuth } = useContext(AuthContext);
  const isLoggedIn = useMemo(
    () => (getAccessToken() ? true : false),
    [auth]
  );

  useEffect(() => {
    let authData = getAuth();
    if (authData !== null) {
      setAuth(authData);
    }
    console.log(auth);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          {!isLoggedIn && (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </>
          )}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="profiles/:userId" element={<Profile />} />
            {isLoggedIn && (
              <>
                <Route path="account" element={<Account />}>
                  <Route index element={<EditProfile />} />
                  <Route path="password" element={<ChangePassword />} />
                  <Route path="verify" element={<VerifyEmail />} />
                  <Route path="delete" element={<DeleteAccount />} />
                  <Route path="admin" element={<AdminDashboard />} />
                  <Route path="*" element={<Navigate to="/account" />} />
                </Route>
                <Route path="upload" element={<Upload />} />
              </>
            )}
            <Route path="photos/:photoId" element={<PhotoDetails />} />
            <Route path="collections/:collectionId" element={<Collection />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
