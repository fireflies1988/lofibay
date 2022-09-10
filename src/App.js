import { useContext, useEffect, useMemo } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import GlobalStyles from "./components/styles/Global";
import AuthContext from "./contexts/AuthProvider";
import { YourCollectionsProvider } from "./contexts/YourCollectionsProvider";
import Account from "./pages/Account";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ChangePassword from "./pages/ChangePassword";
import Collection from "./pages/Collection";
import CollectionSlideshow from "./pages/CollectionSlideshow";
import DeleteAccount from "./pages/DeleteAccount";
import DeletedPhotos from "./pages/DeletedPhotos";
import EditProfile from "./pages/EditProfile";
import FeaturedPhotos from "./pages/admin/FeaturedPhotos";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import PhotoDetails from "./pages/PhotoDetails";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import RejectedPhotos from "./pages/admin/RejectedPhotos";
import SearchResult from "./pages/SearchResult";
import Upload from "./pages/Upload";
import UploadedPhotos from "./pages/admin/UploadedPhotos";
import VerifyEmail from "./pages/VerifyEmail";
import { getAccessToken, getAuth, getRole } from "./utils/Utils";
import Payments from "./pages/Payments";

const theme = {
  colors: {
    brandLightColor: "#0fff4c",
    brandDarkColor: "#00ab4b",
  },
};

function App() {
  const { auth, setAuth } = useContext(AuthContext);
  const isLoggedIn = useMemo(() => (getAccessToken() ? true : false), [auth]);
  const isAdmin = useMemo(() => (getRole() === "Admin" ? true : false), [auth]);

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
            <Route path="search/:keywords" element={<SearchResult />} />
            {isLoggedIn && (
              <>
                <Route path="account" element={<Account />}>
                  <Route index element={<EditProfile />} />
                  <Route path="password" element={<ChangePassword />} />
                  <Route path="verify" element={<VerifyEmail />} />
                  <Route path="payments" element={<Payments />} />
                  <Route path="delete" element={<DeleteAccount />} />
                  <Route path="*" element={<Navigate to="/account" />} />
                </Route>
                <Route path="upload" element={<Upload />} />
              </>
            )}
            {isLoggedIn && isAdmin && (
              <Route path="admin" element={<AdminDashboard />}>
                <Route index element={<UploadedPhotos />} />
                <Route path="featured-photos" element={<FeaturedPhotos />} />
                <Route path="rejected-photos" element={<RejectedPhotos />} />
                <Route path="deleted-photos" element={<DeletedPhotos />} />
              </Route>
            )}
            <Route
              path="photos/:photoId"
              element={
                <YourCollectionsProvider>
                  <PhotoDetails />
                </YourCollectionsProvider>
              }
            />
            <Route path="collections/:collectionId" element={<Collection />}>
              {isLoggedIn && (
                <Route path="slideshow" element={<CollectionSlideshow />} />
              )}
              <Route path="*" element={<Navigate to="./" />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
