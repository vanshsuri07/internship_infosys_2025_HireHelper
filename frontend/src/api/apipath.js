export const BASE_URL = process.env.REACT_APP_API_URL;

export const API_PATHS = {
  AUTH: {
    LOGIN: `${BASE_URL}/api/users/login`,
    REGISTER: `${BASE_URL}/api/users/register`,
    VERIFY_EMAIL: `${BASE_URL}/api/users/verify-email`,
    FORGOT_PASSWORD: `${BASE_URL}/api/users/forgot-password`,
    RESET_PASSWORD: `${BASE_URL}/api/users/reset-password`,
  },
  USER: {
    GET_USER_INFO: `${BASE_URL}/api/users/getUser`,
  },
};
