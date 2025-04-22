// context/authToken.js

import { auth } from "@/lib/firebase";


export const getAuthToken = async () => {
    const user = auth.currentUser;
    if (user) {
        return user.getIdToken();
    }

    console.log(user.getIdToken());

    return null;
};


export const getAuthUser = () => {
    const user = auth.currentUser;
    if (user) {
        return user;
    }

    console.log(user);

    return null;
}
