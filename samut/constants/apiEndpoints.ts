export const APIEndpoints = Object.freeze({
    AUTH: {
        VERIFY_TOKEN: "/auth/verifyToken",
    },
    USER: {
        RETRIEVE: {
        ALL: "/users/retrieve/all",
        CHECK_ISEXIST: "/users/retrieve/checkUser",
        },
        CREATE: "/users/create/createUser",
    },
    RESOURCE: {
        RETRIEVE: {
            ALL: "/resources/retrieve/all",
            ALL_BY_USERID: "/resources/retrieve/all/[userId]",
        },
        CREATE: {
            UPLOAD: "/resources/upload/[userId]",
        },
        DELETE: "/resources/delete/[userId]",
    },
        
});
  