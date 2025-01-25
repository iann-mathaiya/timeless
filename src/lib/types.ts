import type { posts } from "@/actions/posts";
import type { Post } from "@/db/schema";

export type FileType = "image/webp" | "image/jpeg" | "image/png" | "video/mp4";

export type Media = {
    mediaURL: string;
    fileName?: string,
    fileType: FileType;
};

export type UploadedFiles = { fileName: string, fileType: FileType; };

export type FriendRequestStatus = "pending" | "accepted" | "rejected";

export type MatchingUser = {
    id: string;
    name: string;
    email: string;
    profilePicture: string | null;
    friendshipStatus: "pending" | "accepted" | "rejected" | null;
    isRequester: boolean | null;
};

export type PendingFriendRequest = {
    id: string;
    createdAt: Date;
    status: "pending";
    requester: { id: string; name: string; email: string; profilePicture: string | null; };
};

export type PostAuthor = Pick<User, "id" | "name" | "profilePicture">;

export type FriendPost = {
    post: Post;
    author: PostAuthor;
};

export type GoogleUser = {
    sub: string;
    name: string;
    email: string;
    picture: string;
    given_name: string;
    family_name: string;
    email_verified: boolean;
};