export interface Resource {
    resource_id: string;
    user_id: number;
    resource_name: string;
    resource_size: GLfloat,
    resource_type: string;
    resource_url: string;
    create_at: Date;
    update_at: Date;
}
