import { useContext } from "react";
import AuthContext from "../contexts/AuthProvider";
import {
  GET_WITH_AUTH_GET_DELETED_PHOTOS_ENDPOINT_PATH,
  GET_WITH_AUTH_GET_PHOTOS_ENDPOINT_PATH,
  GET_WITH_AUTH_YOUR_COLLECTIONS_ENDPOINT_PATH,
  PATCH_INCREASE_DOWNLOADS_BY_ONE_ENPOINT_PATH,
  PATCH_WITH_AUTH_UPDATE_PHOTO_STATE_ENDPOINT_PATH,
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
          username: null,
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

        return await fetchWithCredentialsAsync(url, requestOptions);
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
        showSnackbar("error", "Unknown error.");
      }
    } catch (err) {
      showSnackbar("error", err.message);
    }
  }

  async function fetchYourCollectionsAsync(setData) {
    try {
      const response = await fetchWithCredentialsAsync(
        `${SERVER_URL}${GET_WITH_AUTH_YOUR_COLLECTIONS_ENDPOINT_PATH}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow",
        }
      );
      const responseData = await response.json();

      if (response.status === 200) {
        setData(responseData?.data);
      } else {
        showSnackbar("error", "Unknown error.");
      }
    } catch (err) {
      showSnackbar("error", err.message);
    }
  }

  async function fetchAdminPhotosAsync(state, orderBy, desc, setData) {
    try {
      const response = await fetchWithCredentialsAsync(
        `${SERVER_URL}${GET_WITH_AUTH_GET_PHOTOS_ENDPOINT_PATH.replace(
          "{state}",
          state
        )
          .replace("{orderBy}", orderBy)
          .replace("{desc}", desc)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow",
        }
      );
      const responseData = await response.json();

      if (response.status === 200) {
        setData(responseData?.data);
      } else if (response.status === 400) {
        showSnackbar("error", responseData?.message);
      } else {
        showSnackbar("error", "Unknown error.");
      }
    } catch (err) {
      showSnackbar("error", err.message);
    }
  }

  async function fetchAdminDeletedPhotosAsync(orderBy, desc, setData) {
    try {
      const response = await fetchWithCredentialsAsync(
        `${SERVER_URL}${GET_WITH_AUTH_GET_DELETED_PHOTOS_ENDPOINT_PATH.replace(
          "{orderBy}",
          orderBy
        ).replace("{desc}", desc)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow",
        }
      );
      const responseData = await response.json();

      if (response.status === 200) {
        setData(responseData?.data);
      } else if (response.status === 400) {
        showSnackbar("error", responseData?.message);
      } else {
        showSnackbar("error", "Unknown error.");
      }
    } catch (err) {
      showSnackbar("error", err.message);
    }
  }

  async function updateAdminPhotoStateAsync(photoId, photoStateId) {
    try {
      const response = await fetchWithCredentialsAsync(
        `${SERVER_URL}${PATCH_WITH_AUTH_UPDATE_PHOTO_STATE_ENDPOINT_PATH.replace(
          "{id}",
          photoId
        ).replace("{photoStateId}", photoStateId)}`,
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
        showSnackbar("success", responseData?.message);
      } else if (response.status === 400 || response.status === 404 || response.status === 422) {
        showSnackbar("error", responseData?.message);
      } else {
        showSnackbar("error", "Unknown error.");
      }
    } catch (err) {
      showSnackbar("error", err.message);
    }
  }

  return {
    increaseDownloadsByOneAsync,
    fetchWithCredentialsAsync,
    likeOrUnlikePhotoAsync,
    fetchYourCollectionsAsync,
    fetchAdminPhotosAsync,
    fetchAdminDeletedPhotosAsync,
    updateAdminPhotoStateAsync,
  };
}

export default useFetch;
