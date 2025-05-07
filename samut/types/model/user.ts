// /types/model/user.ts
import { InstructorDescription } from '@/types/instructor';
export interface User {
    user_id: string;
    email: string;
    name: string;
    gender: string;
    address: string;
    user_type: UserType;
    phone_number: string;
    profile_img: string;
    description: string | null | InstructorDescription;
    created_at: string;
    updated_at: string;
  }

export enum UserType {
    USER = "user",
    INSTRUCTOR = "instructor",
    admin = "admin",
  }

export interface UserCreate {
    firebase_uid: string;
    email: string;
    name: string;
    profile_img?: string;
    user_type: string;
  }