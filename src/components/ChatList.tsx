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
    chats: ChatList | undefined
    unknownChats: ChatList | undefined
    searchs: string[] 
    OpenConfigPage: Function
    newContact: Function
    changeChat: Function
    setSearchs: Function
    setSession: Function
}

export default function ChatListComponent ({peer, chats, OpenConfigPage,newContact, changeChat, searchs, setSearchs, setSession,unknownChats}: Props) {
    const [addPop, setAddPop] = React.useState<boolean>(false)
    const [page, setPage] = React.useState("Contacts")
    let JSX: JSX.Element[] = []

    const addContact = (id:string, name:string)=>{
      let newChat : ChatType = {
        id: id,
        name: name,
        messages: [],
        lastViewMessage_id: "",
        block: false
      }
      newContact({...chats, [id]: newChat})
      // setPage("Contacts")
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
      "Logout": () => { 
        if(peer === undefined) return
        peer.destroy()
        setSession()
      }
    }

    /// move to other file

    let list = page === "Contacts" ? chats : unknownChats

    for (const id in list) {
      if (peer !== undefined && id === peer.id) continue

      const SideButton = ()=>{
        if(!list) return
        let lastMessage = { text: "", timestamp: "" }
        if (list[id].messages.length !== 0) lastMessage = list[id].messages[list[id].messages.length - 1]
        if(lastMessage === undefined) return
  
        let isImage = lastMessage.fileData && lastMessage.fileData.fileName !== ""
        let isAudio = lastMessage.audio && lastMessage.audio !== ""
  
        return <button
          className='side-button'
          onClick={() => { 
            if(page === "Contacts") changeChat(id) 
            else {changeChat(id); changeChat("user")}
          }}
        >
          <FontAwesomeIcon icon={faUserCircle} />
          <div>
            <p dangerouslySetInnerHTML={{ __html: checkSearch(list[id].name, searchs[0]) }}></p>
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
        </button>
      }

      JSX.push(<SideButton key={Math.random()}/>)
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
      <nav className="page-nav">
        <button className={page === "Contacts" ? "active" : ""} onClick={()=>{
          setPage("Contacts")
        }}>Contacts</button>
        <button className={page === "Unknown" ? "active" : ""} onClick={()=>{
          setPage("Unknown")
        }}>Unknown</button>
      </nav>
      <ul className="chat-list">{JSX}</ul>
    </aside>
}