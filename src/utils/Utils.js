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

export function getRole() {
  return getAuth()?.role;
}

export function saveTokens(accessToken, refreshToken) {
  saveAuth({
    ...getAuth(),
    accessToken: accessToken,
    refreshToken: refreshToken,
  });
}

export function saveAvatarUrl(avatarUrl) {
  saveAuth({
    ...getAuth(),
    avatarUrl: avatarUrl,
  });
}

export function saveAuth(auth) {
  localStorage.setItem("auth", JSON.stringify(auth));
}

export function removeAuth() {
  localStorage.removeItem("auth");
}

export function youLikedThisPhoto(likedPhotos) {
  if (getUserId() !== null) {
    for (let i = 0; i < likedPhotos?.length; i++) {
      if (getUserId() === likedPhotos[i]?.userId) {
        return true;
      }
    }
  }
  return false;
}

export function isThisPhotoAlreadyInOneOfYourCollection(photoId, yourCollections) {
  for (let i = 0; i < yourCollections?.length; i++) {
    for (let j = 0; j < yourCollections[i]?.photoCollections?.length; j++) {
      if (yourCollections[i]?.photoCollections[j]?.photoId == photoId) {
        return true;
      }
    }
  }
  return false;
}
