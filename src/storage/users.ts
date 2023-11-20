import { ChatList } from "../vite-env";

type UsersList = {
    [key: string]: {
        _id: string
        password: string
        chats: ChatList
    }
}

export const users: UsersList = {
    "00001": {
        _id: "00001",
        password: "12345",
        chats: {
            "00002": {
                id: "00002",
                name: "Chat 00002",
                messages: [],
                lastViewMessage_id: "",
                block: false
            },
            "00003": {
                id: "00003",
                name: "Chat 3 testing",
                messages: [],
                lastViewMessage_id: "",
                block: false
            }
        }
    },
    "00002": {
        _id: "00002",
        password: "12345",
        chats: {
            "00001": {
                id: "00001",
                name: "Chat 00001",
                messages: [],
                lastViewMessage_id: "",
                block: false
            },
            "00004": {
                id: "00004",
                name: "Chat 4 random",
                messages: [],
                lastViewMessage_id: "",
                block: false
            }
        }
    },
    "00003": {
        _id: "00003",
        password: "12345",
        chats: {
            "00001": {
                id: "00001",
                name: "Chat 00001",
                messages: [],
                lastViewMessage_id: "",
                block: false
            },
            "00004": {
                id: "00004",
                name: "Chat 4 testing",
                messages: [],
                lastViewMessage_id: "",
                block: false
            }
        }
    },
    "00004": {
        _id: "00004",
        password: "12345",
        chats: {
            "00002": {
                id: "00002",
                name: "Chat 2",
                messages: [],
                lastViewMessage_id: "",
                block: false
            },
            "00003": {
                id: "00003",
                name: "Chat 3 testing",
                messages: [],
                lastViewMessage_id: "",
                block: false
            }
        }
    }
}
