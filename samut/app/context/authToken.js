// context/authToken.js
import { auth } from "@/app/lib/firebase";

export const getAuthToken = async () => {
    const user = auth.currentUser;
    if (user) {
        return user.getIdToken();
    }
    return null;
};


export const getAuthUser = () => {
    const user = auth.currentUser;
    if (user) {
        return user;
    }
    return null;
}
