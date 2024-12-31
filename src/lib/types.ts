export type FileType = "image/webp" | "image/jpeg" | "image/png" | "video/mp4"

export type Media = {
    mediaURL: string
    fileType: FileType
}

export type UploadedFiles =  { fileName: string, fileType: FileType };