import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import {
  PATCH_INCREASE_DOWNLOADS_BY_ONE_ENPOINT_PATH,
  POST_REFRESH_TOKEN_ENDPOINT_PATH,
  POST_WITH_AUTH_LIKE_OR_UNLIKE_PHOTO_ENDPOINT_PATH,
  SERVER_URL,
} from "../utils/Endpoints";
import {
  getAccessToken,
  getAuth,
  getRefreshToken,
  getUserId,
  removeAuth,
  saveTokens,
} from "../utils/Utils";
import useNotistack from "./useNotistack";

function useFetch() {
  const { showSnackbar } = useNotistack();
  const { auth, setAuth } = useContext(AuthContext);

  async function fetchWithCredentialsAsync(url, requestOptions) {
    requestOptions.headers = requestOptions.headers || {};
    requestOptions.headers.Authorization = `bearer ${getAccessToken()}`;
    const response = await fetch(url, requestOptions);

    if (response?.status === 401 && response.headers.has("Token-Expired")) {
      // access token is expired, call refresh token
      const refreshTokenResponse = await fetch(
        `${SERVER_URL}${POST_REFRESH_TOKEN_ENDPOINT_PATH}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: getUserId(),
            refreshToken: getRefreshToken(),
          }),
          redirect: "follow",
        }
      );
      const refreshTokenResponseData = await refreshTokenResponse.json();

      if (refreshTokenResponse.status === 422) {
        // refresh token expired, logout
        removeAuth();
        setAuth({
          accessToken: null,
          refreshToken: null,
          userId: null,
          avatarUrl: null,
          role: null,
        });

        return response;
      }

      if (refreshTokenResponse.status === 200) {
        // new access token, refresh token
        saveTokens(
          refreshTokenResponseData?.data?.accessToken,
          refreshTokenResponseData?.data?.refreshToken
        );
        setAuth((auth) => ({ ...auth, ...getAuth() }));

        return await fetchWithCredentialsAsync(url, requestOptions, setAuth);
      }
    }

    return response;
  }

  async function increaseDownloadsByOneAsync(photoId) {
    try {
      const response = await fetch(
        `${SERVER_URL}${PATCH_INCREASE_DOWNLOADS_BY_ONE_ENPOINT_PATH.replace(
          "{id}",
          `${photoId}`
        )}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow",
        }
      );
      const responseData = await response.json();
      if (response.status === 200) {
      } else if (response.status === 404 || response.status === 422) {
        showSnackbar("error", responseData?.message);
      } else {
        showSnackbar("error", "Unknown error.");
      }
    } catch (err) {
      showSnackbar("error", err.message);
    }
  }

  async function likeOrUnlikePhotoAsync(photoId, liked, setLiked) {
    if (!auth?.accessToken) {
      showSnackbar("info", "You need to login to use this feature.");
      return;
    }

    try {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
      };
      const response = await fetchWithCredentialsAsync(
        `${SERVER_URL}${POST_WITH_AUTH_LIKE_OR_UNLIKE_PHOTO_ENDPOINT_PATH.replace(
          "{id}",
          `${photoId}`
        )}`,
        requestOptions
      );
      const responseData = await response.json();
      if (response.status === 200) {
        setLiked((liked) => !liked);
      } else if (response.status === 404 || response.status === 422) {
        showSnackbar("error", responseData?.message);
      } else {
        showSnackbar("error", "Unknown error.")
      }
    } catch (err) {
      showSnackbar("error", err.message);
    }
  }

  return { increaseDownloadsByOneAsync, fetchWithCredentialsAsync, likeOrUnlikePhotoAsync };
}

export default useFetch;