// /type/model/instructor_request.ts
export interface InstructorRequestData {
    full_name: string;
    phone_number: string;
    address: string;
    profile_image: string;
    date_of_birth: string;
    education_record: string;
    id_card_url: string;
    contact_channels: { line?: string; facebook?: string; instagram?: string };
    swimming_instructor_license: string;
    teaching_history?: string;
    additional_skills?: string;
  }
  
  export interface InstructorRequest extends InstructorRequestData {
    request_id: string;
    user_id: string;
    status: string;
    rejection_reason: string | null;
    created_at: string;
    updated_at: string;
    user: {
      user_id: string;
      firebase_uid: string;
      email: string;
      name: string;
      password: string | null;
      gender: string | null;
      address: string | null;
      phone_number: string | null;
      profile_img: string | null;
      user_type: string;
      description: string | null | { [key: string]: any };
      created_at: string;
      updated_at: string;
    };
  }