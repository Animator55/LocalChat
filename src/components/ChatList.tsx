import { faUserCircle, faUserPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import checkSearch from "../logic/checkSearch"
import SearchBar from "./SearchBar"
import ChatConfig from "./ChatConfig"
import { ChatList } from "../vite-env"

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
    let JSX: JSX.Element[] = []

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
      "Select Chats": () => { },
      "Logout": () => { }
    }

    /// move to other file

    for (const id in chats) {
      if (peer !== undefined && id === peer.id) continue

      let lastMessage = { text: "", timestamp: "" }
      if (chats[id].messages.length !== 0) lastMessage = chats[id].messages[chats[id].messages.length - 1]

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
              <h5 className='ellipsis' style={{ fontWeight: 100 }}>{lastMessage.text}</h5>
              <h5 style={{ fontWeight: 100 }}>{lastMessage.timestamp}</h5>
            </div>
          </div>
        </button>)
    }

    const AddButton = () => {
      return <button className='add-button' onClick={() => {
        changeChats({ ...chats, "00003": { id: "00003", name: "Chat 3", messages: [] } })
      }}><FontAwesomeIcon icon={faUserPlus} /></button>
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
      <AddButton />
      <ul className="chat-list">{JSX}</ul>
    </aside>
}