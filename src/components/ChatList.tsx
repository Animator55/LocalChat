import { faImage, faMicrophone, faUserCircle, faUserPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import checkSearch from "../logic/checkSearch"
import SearchBar from "./SearchBar"
import ChatConfig from "./ChatConfig"
import { ChatList, ChatType } from "../vite-env"
import AddContact from "./AddContact"
import React from "react"

type Props = {
    peer: any
    chats: ChatList
    searchs: string[] 
    OpenConfigPage: Function
    changeChats: Function
    changeChat: Function
    setSearchs: Function
}

export default function ChatListComponent ({peer, chats, OpenConfigPage,changeChats, changeChat, searchs, setSearchs}: Props) {
    const [addPop, setAddPop] = React.useState<boolean>(false)
    let JSX: JSX.Element[] = []

    const addContact = (id:string, name:string)=>{
      let newChat : ChatType = {
        id: id,
        name: name,
        messages: [],
        lastViewMessage_id: "",
        notifications: true,
      }
      changeChats({...chats, [id]: newChat})
    }

    const configFunctions = {
      "Configuration": () => {
        OpenConfigPage()
      },
      "Search chat": (e) => {
        let search = e.currentTarget.parentElement.parentElement.previousSibling as HTMLElement
        if (search === null) return
        let input = search.children[1] as HTMLInputElement
        input.classList.add("expanded")
        input.focus()
      },
      "Logout": () => { }
    }

    /// move to other file

    for (const id in chats) {
      if (peer !== undefined && id === peer.id) continue

      let lastMessage = { text: "", timestamp: "" }
      if (chats[id].messages.length !== 0) lastMessage = chats[id].messages[chats[id].messages.length - 1]
      if(lastMessage === undefined) return

      let isImage = lastMessage.fileData && lastMessage.fileData.fileName !== ""
      let isAudio = lastMessage.audio && lastMessage.audio !== ""

      JSX.push(
        <button
          className='side-button'
          key={Math.random()}
          onClick={() => { changeChat(id) }}
        >
          <FontAwesomeIcon icon={faUserCircle} />
          <div>
            <p dangerouslySetInnerHTML={{ __html: checkSearch(chats[id].name, searchs[0]) }}></p>
            <div className='sub-title'>
              <h5 className='ellipsis' style={{ fontWeight: 100 }}>
                {isImage && <FontAwesomeIcon icon={faImage}/>}
                {isAudio && <FontAwesomeIcon icon={faMicrophone}/>}
                {lastMessage.text === "" ? 
                    isImage ? <p>Image</p> : isAudio ? <p>Audio</p> : null
                    :
                    <p>{lastMessage.text}</p>
                }
              </h5>
              <h5 style={{ fontWeight: 100 }}>{lastMessage.timestamp}</h5>
            </div>
          </div>
        </button>)
    }

    const AddButton = () => {
      return <button className='add-button' onClick={()=>{setAddPop(true)}}><FontAwesomeIcon icon={faUserPlus} /></button>
    }

    return <aside className='side-bar'>
      <header>
        <SearchBar
          searchButton={(query: string) => {
            setSearchs([query, searchs[1]])
          }}
          placeholder={"Search chat..."}
          defaultValue={searchs[0]}
        />
        <ChatConfig mode={"chat"} functions={configFunctions} />
      </header>
      {addPop && <AddContact confirm={addContact} close={()=>{setAddPop(false)}}/>}
      <AddButton />
      <ul className="chat-list">{JSX}</ul>
    </aside>
}