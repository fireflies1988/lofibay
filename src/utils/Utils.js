import { POST_REFRESH_TOKEN_ENDPOINT_PATH, SERVER_URL } from "./Api";

export async function fetchWithCredentialsAsync(
  url,
  requestOptions,
  auth,
  setAuth
) {
  requestOptions.headers = requestOptions.headers || {};
  requestOptions.headers.Authorization = `bearer ${auth.accessToken}`;
  const response = await fetch(url, requestOptions);

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
          userId: auth.userId,
          refreshToken: auth.refreshToken,
        }),
        redirect: "follow",
      }
    );
    const refreshTokenResponseData = await refreshTokenResponse.json();

    if (refreshTokenResponse.status === 422) {
      // refresh token expired, logout
      localStorage.removeItem("auth");
      setAuth({
        accessToken: null,
        refreshToken: null,
        userId: null,
        avatarUrl: null,
        role: null,
      });
      return response;
    } else if (refreshTokenResponse.status === 200) {
      // new access token, refresh token
      const newAuthData = {
        ...auth,
        accessToken: refreshTokenResponseData?.data?.accessToken,
        refreshToken: refreshTokenResponseData?.data?.refreshToken,
      };
      setAuth(newAuthData);
      localStorage.setItem("auth", JSON.stringify(newAuthData));

      return await fetchWithCredentialsAsync(
        url,
        requestOptions,
        auth,
        setAuth
      );
    } else {
      return response;
    }
  }

  return response;
}
