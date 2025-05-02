export const APIEndpoints = Object.freeze({
    AUTH: {
        VERIFY_TOKEN: "/auth/verifyToken",
    },
    USER: {
        RETRIEVE: {
            ALL: "/users/retrieve/all",
            CHECK_ISEXIST: "/users/retrieve/checkUser",
            DATA_BY_USERID: "/users/retrieve/[userId]",
        },
        CREATE: "/users/create/createUser",
        UPDATE: {
            USER: "/users/update/[userId]",
        },
    },
    RESOURCE: {
        CREATE: {
          UPLOAD: '/resources/upload/[userId]',
          UPLOAD_PROFILE_IMAGE: '/resources/upload-profile-image/[userId]',
          UPLOAD_ID_CARD: '/resources/upload-id-card/[userId]',
          UPLOAD_SWIMMING_LICENSE: '/resources/upload-swimming-license/[userId]',
        },
        RETRIEVE: {
          ALL: '/resources/retrieve/all',
          ALL_BY_USERID: '/resources/retrieve/all/[userId]',
        },
        DELETE: '/resources/delete/[userId]',
    },
    INSTRUCTOR_REQUEST: {
        SUBMIT: '/instructor-requests/submit/[userId]',
        UPDATE: '/instructor-requests/update/[requestId]',
        RETRIEVE: {
          ALL: '/instructor-requests/all',
          BY_ID: '/instructor-requests/[requestId]',
          BY_USER_ID: '/instructor-requests/user/[userId]',
        },
        APPROVE: '/instructor-requests/approve/[requestId]',
        REJECT: '/instructor-requests/reject/[requestId]',
    },
    TEACHER: {
        RETRIEVE: {
          ALL: "/users/retrieve/getAllTeachers",
        },
    },
    COURSE: {
    RETRIEVE: {
        ALL: "/courses/retrieve/all",
        },
    },
})    
