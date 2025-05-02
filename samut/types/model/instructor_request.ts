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