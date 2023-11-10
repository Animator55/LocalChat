/// <reference types="vite/client" />

export type MessageType = {
    _id: string
    text: string
    timestamp: string
    owner: string
    answer_message?: MessageType | undefined
    fileData?: FileType | undefined
}

export type FileType = { 
    file: Blob | ArrayBuffer | string | null | File
    fileName: string
    fileType: string
}

export type ChatType = {
    id: string
    name: string
    messages: Message[]
    lastViewMessage_id: string
}

export type ChatList = {
    [key: string]: ChatType
}

export type SessionType = {
    name: string
    _id: string
    image: string | undefined
}