/// <reference types="vite/client" />

export type MessageType = {
    _id: string
    text: string
    timestamp: string
    owner: string
    answer_message?: MessageType | undefined
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