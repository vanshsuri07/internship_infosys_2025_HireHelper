export const BASE_URL = process.env.REACT_APP_API_URL;

export const API_PATHS = {
  AUTH: {
    LOGIN: `${BASE_URL}/api/users/login`,
    REGISTER: `${BASE_URL}/api/users/register`,
    VERIFY_EMAIL: `${BASE_URL}/api/users/verify-email`,
    FORGOT_PASSWORD: `${BASE_URL}/api/users/forgot-password`,
    RESET_PASSWORD: `${BASE_URL}/api/users/reset-password`,
    UPDATE_PROFILE: `${BASE_URL}/api/users/update-profile`,
  },
  USER: {
    GET_USER_INFO: `${BASE_URL}/api/users/getUser`,
  },
  TASK: {
    GET_ALL_TASKS: `${BASE_URL}/api/tasks`,
    CREATE_TASK: `${BASE_URL}/api/tasks`,
    GET_MY_TASKS: `${BASE_URL}/api/tasks/my`,
    GET_TASK_BY_ID: (taskId) => `${BASE_URL}/api/tasks/${taskId}`,
    UPDATE_TASK: (taskId) => `${BASE_URL}/api/tasks/${taskId}`,
    DELETE_TASK: (taskId) => `${BASE_URL}/api/tasks/${taskId}`,
  },
  REQUESTS: {
    CREATE_REQUEST: `${BASE_URL}/api/requests`,
    GET_MY_REQUESTS: `${BASE_URL}/api/requests/received`,
    GET_SENT_REQUESTS: `${BASE_URL}/api/requests/sent`,
    UPDATE_REQUEST_STATUS: (requestId) =>
      `${BASE_URL}/api/requests/${requestId}`,
  },
  NOTIFICATION: {
    GET_NOTIFICATIONS: `${BASE_URL}/api/notifications`,
    MARK_AS_READ: (notificationId) =>
      `${BASE_URL}/api/notifications/${notificationId}/read`,
  },
};
