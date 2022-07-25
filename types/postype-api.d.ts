import { PostypeChannel } from "./types";
declare const UPLOAD_EXAMPLE: {
    created_at: number;
    file_id: number;
    file_name: string;
    full_path: string;
    height: number;
    original_name: string;
    thumbnail: string;
    width: number;
    mimetype: string;
};
export declare const postype: {
    login: (email: string, password: string) => Promise<void>;
    getChannels: () => Promise<PostypeChannel[]>;
    getNewPostId: (blogId: string) => Promise<string>;
    savePost: (blogId: string, postId: string, title: string, content: string) => Promise<any>;
    uploadFile: (postId: string, fileB64: string) => Promise<typeof UPLOAD_EXAMPLE>;
};
export {};
