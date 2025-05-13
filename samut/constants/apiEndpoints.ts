export const API_BASE_URL = "http://localhost:8000"
export const APIEndpoints = Object.freeze({
  AUTH: {
    VERIFY_TOKEN: "/auth/verifyToken",
  },
  USER: {
    RETRIEVE: {
      ALL: "/users/retrieve/getAllUsers",
      CHECK_ISEXIST: "/users/retrieve/checkUser",
      DATA_BY_USERID: "/users/retrieve/[userId]",
    },
    CREATE: "/users/create/createUser",
    UPDATE: {
      USER: "/users/update/[userId]",
    },

    RESOURCE: {
        CREATE: {
          UPLOAD: '/resources/upload/[userId]',
          UPLOAD_PROFILE_IMAGE: '/resources/upload-profile-image/[userId]',
          UPLOAD_ID_CARD: '/resources/upload-id-card/[userId]',
          UPLOAD_SWIMMING_LICENSE: '/resources/upload-swimming-license/[userId]',
          UPLOAD_COURSE_IMAGE: '/resources/upload-course-image/[courseId]',
          UPLOAD_POOL_IMAGE: '/resources/upload-pool-image/[courseId]',
        },
        RETRIEVE: {
          ALL: '/resources/retrieve/all',
          ALL_BY_USERID: '/resources/retrieve/all/[userId]',
        },
        DELETE: '/resources/delete/[userId]',

    },
    RETRIEVE: {
      ALL: "/resources/retrieve/all",
      ALL_BY_USERID: "/resources/retrieve/all/[userId]",
    },
    DELETE: "/resources/delete/[userId]",
  },
  INSTRUCTOR_REQUEST: {
    SUBMIT: "/instructor-requests/submit/[userId]",
    UPDATE: "/instructor-requests/update/[requestId]",
    RETRIEVE: {
      ALL: "/instructor-requests/all",
      BY_ID: "/instructor-requests/[requestId]",
      BY_USER_ID: "/instructor-requests/user/[userId]",
    },
    APPROVE: "/instructor-requests/approve/[requestId]",
    REJECT: "/instructor-requests/reject/[requestId]",
  },
  INSTRUCTOR: {
    RETRIEVE: {
      ALL: "/users/retrieve/getAllInstructors",
    },
  },
  COURSE: {
    RETRIEVE: {
      ALL: "/courses/retrieve/getAllCourses",
      BY_ID: "/courses/retrieve/[courseId]",
    },
    CREATE: "/courses/create",
    UPDATE: "/courses/update/[courseId]",
    DELETE: "/courses/delete/[courseId]",
  },
  PAYMENT: {
    CREATE_PROMPTPAY_SESSION: `${API_BASE_URL}/payment/create-checkout-session`,
  },
  NOTIFICATION: {
    RETRIEVE: {
      BY_USER_ID: "/notifications/user/[userId]",
    },
    UPDATE: {
      READ: "/notifications/read/[notificationId]",
    },
  },
})
