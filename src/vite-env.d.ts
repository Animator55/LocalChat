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
    file: string
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

export type ChachedFilesType = {
    [key: string]: Uint8Array | null
}

export type SessionType = {
    name: string
    _id: string
    image: string | undefined
}