// /types/model/user.ts
export interface User {
    user_id: string;
    email: string;
    name: string;
    gender: string;
    address: string;
    phone_number: string;
    profile_img: string;
    description: string;
  }

export interface UserCreate {
    firebase_uid: string;
    email: string;
    name: string;
    profile_img?: string;
    user_type: string;
  }