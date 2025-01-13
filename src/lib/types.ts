export type FileType = "image/webp" | "image/jpeg" | "image/png" | "video/mp4"

export type Media = {
    mediaURL: string
    fileType: FileType
}

export type UploadedFiles =  { fileName: string, fileType: FileType };

export type FriendRequestStatus = "pending" | "accepted" | "rejected"

export type MatchingUser = {
    id: string;
    name: string;
    email: string;
    image: string | null;
    friendshipStatus: "pending" | "accepted" | "rejected" | null;
    isRequester: boolean | null;
}