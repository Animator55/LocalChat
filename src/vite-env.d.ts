/// <reference types="vite/client" />

export type MessageType = {
    text: string
    timestamp: string
    owner: string
    state: string
}

export type ChatType = {
    id: string
    name: string
    messages: Message[]
}

export type ChatList = {
    [key: string]: ChatType
}