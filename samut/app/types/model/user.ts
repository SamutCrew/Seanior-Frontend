export interface UserCreate {
    firebase_uid: string;
    email: string;
    name: string;
    profile_img?: string;
    user_type: string;
  }