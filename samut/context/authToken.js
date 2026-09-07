// context/authToken.js

import { auth } from "@/lib/firebase";
import { isDemoMode } from "@/lib/demoMode";
import { getDemoSession } from "@/mocks/authMock";

export const getAuthToken = async () => {
    if (isDemoMode) {
        return getDemoSession() ? "demo-token" : null;
    }

    const user = auth.currentUser;
    if (user) {
        return user.getIdToken();
    }

    return null;
};


export const getAuthUser = () => {
    if (isDemoMode) {
        return getDemoSession();
    }

    const user = auth.currentUser;
    if (user) {
        return user;
    }
    return null;
}
