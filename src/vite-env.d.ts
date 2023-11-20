/// <reference types="vite/client" />

export type MessageType = {
    _id: string
    text: string
    audio?: any
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
    block: boolean
}

export type ChatList = {
    [key: string]: ChatType
}

export type ChachedFilesType = {
    [key: string]: Uint8Array | null
}

export type SessionType = {
    _id: string
    password: string
    image: string | undefined
}