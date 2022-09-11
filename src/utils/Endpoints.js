export const SERVER_URL = "https://localhost:7039/";
export const POST_LOGIN_ENDPOINT_PATH = "api/users/login";
export const POST_SIGNUP_ENDPOINT_PATH = "api/users/signup";
export const GET_WITH_AUTH_USER_INFO_ENDPOINT_PATH = "api/users/current";
export const POST_REFRESH_TOKEN_ENDPOINT_PATH = "api/users/refresh-token";
export const PATCH_WITH_AUTH_UPDATE_USER_ENDPOINT_PATH = "api/users/current";
export const PATCH_WITH_AUTH_CHANGE_PASSWORD_ENDPOINT_PATH = "api/users/current/password/change";
export const GET_USER_INFO_BY_ID_ENDPOINT_PATH = "api/users/{id}";
export const POST_WITH_AUTH_UPLOAD_PHOTO_ENDPOINT_PATH = "api/photos";
export const GET_USER_UPLOADED_PHOTOS_ENDPOINT_PATH = "api/users/{id}/photos";
export const GET_ALL_PHOTOS_ENDPOINT_PATH = "api/photos";
export const GET_PHOTO_DETAILS_BY_ID_ENDPOINT_PATH = "api/photos/{id}";
export const GET_PHOTOS_THAT_USER_LIKED_ENDPOINT_PATH = "api/users/{id}/liked-photos";
export const POST_WITH_AUTH_LIKE_OR_UNLIKE_PHOTO_ENDPOINT_PATH = "api/photos/{id}/like-or-unlike";
export const PUT_WITH_AUTH_UPDATE_PHOTO_INFO_ENDPOINT_PATH = "api/photos/{id}";
export const DELETE_WITH_AUTH_SOFT_DELETE_PHOTO_ENPOINT_PATH = "api/photos/{id}/soft";
export const GET_USER_COLLECTIONS_ENDPOINT_PATH = "api/users/{id}/collections";
export const GET_WITH_AUTH_YOUR_COLLECTIONS_ENDPOINT_PATH = "api/users/current/collections";
export const GET_COLLECTION_INFO_ENPOINT_PATH = "api/collections/{id}";
export const GET_PHOTOS_OF_COLLECTION_ENDPOINT_PATH = "api/collections/{id}/photos";
export const PATCH_WITH_AUTH_UPDATE_COLLECTION_BY_ID_ENDPOINT_PATH = "api/collections/{id}";
export const DELETE_WITH_AUTH_COLLECTION_BY_ID_ENDPOINT_PATH = "api/collections/{id}";
export const PATCH_INCREASE_DOWNLOADS_BY_ONE_ENPOINT_PATH = "api/photos/{id}/download";
export const POST_WITH_AUTH_CREATE_NEW_COLLECTION_ENPOINT_PATH = "api/collections";
export const POST_WITH_AUTH_ADD_OR_REMOVE_PHOTO_TO_OR_FROM_COLLECTION_ENDPOINT_PATH = "api/collections/{id}/add-or-remove-photo?photoId={photoId}";
export const POST_WITH_AUTH_RESEND_VERIFICATION_CODE_ENDPOINT_PATH = "api/users/current/resend-verification-code";
export const POST_WITH_AUTH_VERIFY_YOUR_EMAIL_ENDPOINT_PATH = "api/users/current/verify";
export const POST_FORGOT_PASSWORD_ENDPOINT_PATH = "api/users/password/forgot";
export const GET_WITH_AUTH_GET_PHOTOS_ENDPOINT_PATH = "api/admin/photos?state={state}&orderBy={orderBy}&desc={desc}";
export const GET_WITH_AUTH_GET_DELETED_PHOTOS_ENDPOINT_PATH = "api/admin/photos/deleted?orderBy={orderBy}&desc={desc}";
export const PATCH_WITH_AUTH_UPDATE_PHOTO_STATE_ENDPOINT_PATH = "api/admin/photos/{id}?photoStateId={photoStateId}";
export const GET_SEARCH_PHOTOS_BY_KEYWORD_ENDPOINT_PATH = "api/photos?keywords={keywords}";
export const GET_SEARCH_COLLECTIONS_BY_KEYWORD_ENDPOINT_PATH = "api/collections?keywords={keywords}";
export const GET_WITH_AUTH_NOTIFICATIONS_ENDPOINT_PATH = "api/users/current/notifications";
export const PATCH_WITH_AUTH_MARK_NOTIFICATIONS_AS_READ_ENDPOINT_PATH = "api/users/current/notifications/mark-as-read";
export const PATCH_WITH_AUTH_UPDATE_PAYMENT_INFO_ENDPOINT_PATH = "api/users/current/payments";
export const GET_WITH_AUTH_TAGS_ENDPOINT_PATH = "api/admin/tags?keyword={keyword}&bad={bad}";
export const DELETE_WITH_AUTH_TAG_BY_NAME_ENDPOINT_PATH = "api/admin/tags/{name}";