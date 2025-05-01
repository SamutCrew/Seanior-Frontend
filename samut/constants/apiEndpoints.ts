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
          },
          RETRIEVE: {
            ALL: '/resources/retrieve/all',
            ALL_BY_USERID: '/resources/retrieve/all/[userId]',
          },
          DELETE: '/resources/delete/[userId]'
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
