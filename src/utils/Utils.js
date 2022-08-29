import { POST_REFRESH_TOKEN_ENDPOINT_PATH, SERVER_URL } from "./Endpoints";

export async function fetchWithCredentialsAsync(
  url,
  requestOptions,
  setAuth
) {
  requestOptions.headers = requestOptions.headers || {};
  requestOptions.headers.Authorization = `bearer ${getAccessToken()}`;
  const response = await fetch(url, requestOptions);
  response.headers.forEach(function (value, name) {
    console.log(name + ": " + value);
  });

  if (response?.status === 401) {
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
      saveTokens(refreshTokenResponseData?.data?.accessToken, refreshTokenResponseData?.data?.refreshToken)
      setAuth((auth) => ({...auth, ...getAuth()}));

      return await fetchWithCredentialsAsync(
        url,
        requestOptions,
        setAuth
      );
    }
  }

  return response;
}

export function getAuth() {
  return JSON.parse(localStorage.getItem("auth"));
}

export function getAccessToken() {
  return getAuth()?.accessToken;
}

export function getRefreshToken() {
  return getAuth()?.refreshToken;
}

export function getUserId() {
  return getAuth()?.userId;
}

export function saveTokens(accessToken, refreshToken) {
  let auth = getAuth();
  saveAuth({
    ...auth,
    accessToken: accessToken,
    refreshToken: refreshToken
  });
}

export function saveAuth(auth) {
  localStorage.setItem("auth", JSON.stringify(auth));
}

export function removeAuth() {
  localStorage.removeItem("auth");
}
