import React from 'react'
import { ChachedFilesType, ChatList, ChatType, FileType, MessageType, SessionType } from './vite-env'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCheckCircle, faEllipsisVertical, faGear, faImage, faMagnifyingGlass, faPaperPlane, faPhone, faPlus, faPlusCircle, faSmile, faUserCircle, faUserPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import Message from './components/Message'
import Peer from 'peerjs'
import './assets/App.css'
import SearchBar from './components/SearchBar'
import checkSearch from './logic/checkSearch'
import ChatConfig from './components/ChatConfig'
import AlwaysScrollToBottom from './components/AlwaysScrollToBottom'
import ConfigPage from './components/ConfigPage'
// import {Peer} from './logic/peerjs.min';

const defaultChats: ChatList = {
  "00001": {
    id: "00001",
    name: "Chat 1",
    messages: [],
    lastViewMessage_id: "",
    notifications: true
  },
  "00002": {
    id: "00002",
    name: "Chat 2",
    messages: [],
    lastViewMessage_id: "",
    notifications: true
  },
  "00003": {
    id: "00003",
    name: "Chat 3",
    messages: [],
    lastViewMessage_id: "",
    notifications: true
  }
}

type Connections = {
  on: Function
  connect: Function
  id: string
  peer: string
}


let online: string[] = []
let conn: Connections | undefined
let peer: Connections | undefined
// let callVar

let cachedFile : ChachedFilesType = {} //caches the blob and adds it to the next message
let temporalFile : Uint8Array | null = null

const checkNullCachedFile = ()=>{
  let result: string | null = null
  for(const id in cachedFile) {
    if(cachedFile[id] === null) {
      result = id
      break
    }
  }
  return result
}

export default function App() {
  const [session, setSession] = React.useState<undefined | SessionType>(undefined)
  const [chats, changeChats] = React.useState<ChatList>(defaultChats)
  const [currentChat, setCurrentChat] = React.useState<string | undefined>()
  const inputChat = React.useRef(null)
  const [searchs, setSearchs] = React.useState<string[]>(["", ""])
  const [Answer, setAnswer] = React.useState("")

  const [refresh, activateRefresh] = React.useState<boolean>(false)
  const fileInput = React.useRef<HTMLInputElement | null>(null)

  const fileCheckToBlob = (message:MessageType) : MessageType | undefined =>{
    if(message instanceof Uint8Array){
      let entry = checkNullCachedFile()
      if(entry === null) temporalFile = message
      else {
        cachedFile[entry] = message
        activateRefresh(!refresh)
      }
      return undefined
    }
    if(message.fileData !== undefined && message.fileData.file !== undefined){
      cachedFile = {...cachedFile, [message.fileData.file]: temporalFile}
      temporalFile = null
    }
    return message
  }

  const getLastMessageOfOwner = (chatID: string, owner: string): string => {
    let message_id = ""
    if (chats[chatID].messages.length === 0) return message_id

    for (let i = chats[chatID].messages.length - 1; i > 0; i--) {
      if (chats[chatID].messages[i].owner === owner) {
        message_id = chats[chatID].messages[i]._id
        break
      }
    }

    return message_id
  }

  const addMessage = (data: MessageType | undefined) => {
    if (conn === undefined || peer === undefined || data === undefined) return

    let origin = data.owner === peer.id //is the client owner of the message?
    let id = origin ? conn.peer : data.owner
    if (chats[id] === undefined) return
    chats[id].messages.push(data)
    let lastView = origin ? chats[id].lastViewMessage_id : getLastMessageOfOwner(id, peer.id)
    changeChats({ ...chats, [id]: { ...chats[id], messages: chats[id].messages, lastViewMessage_id: lastView } })
    if (data.owner === conn.peer) conn.send({ _id: data._id, owner: peer.id, timestamp: "readed" })
  }

  const setReadedLastMessage = (message_id: string, owner: string) => {
    console.log(message_id, owner, chats)
    changeChats({ ...chats, [owner]: { ...chats[owner], lastViewMessage_id: message_id } })
  }

  const connectToPeer = (chat: string | undefined) => { // trys to connect to peers, if chat is undefined, func will loop
    if (conn !== undefined) return

    function closeConn() {
      // changeStatus('')
      console.log('you changed the chat')
      // if(callVar !== undefined && conn !== undefined){
      //     callVar.close()
      //     conn.send('close call')
      // } 
      conn = undefined
    }
    const checkLastMessage = (chat: string) => {
      if (chats[chat].messages.length === 0) return
      let lastMessage = chats[chat].messages[chats[chat].messages.length - 1]
      if (lastMessage.owner === peer.id) return
      console.log("sending seen")
      conn.send({ _id: lastMessage._id, owner: peer.id, timestamp: "readed" })
    }

    if (chat !== undefined) {
      console.log('Connecting to ' + chat)
      conn = peer.connect(chat)
      conn.on('close', closeConn)
      checkLastMessage(chat)

      if (conn.peer === currentChat) console.log("connecting")
      // if(statusH.current.innerText === ''){
      //     changeStatus('connecting...')
      // }
    }
    else {
      for (const key in chats) {
        if (key !== peer.id) {
          console.log('Trying to connect to ' + chats[key].name)
          conn = peer.connect(chats[key])
          conn.on('close', closeConn)
        }
      }
      // changeStatus('')
    }
  }
  function connection(id: string) { //crea tu session
    peer = new Peer(id);
    if (peer === undefined) return

    peer.on('error', function (err) {
      switch (err.type) {
        case 'unavailable-id':
          console.log({ id: 'Console', text: id + ' is taken', hour: 'now' })
          peer = undefined
          break
        case 'peer-unavailable':
          console.log('user offline')
          break
        default:
          conn = undefined
          // changeStatus('')
          console.log({ id: 'Console', text: 'an error happened', hour: 'now' })
      }
      return false;
    })
    peer.on('open', function (id: string) {
      if (peer === undefined || peer.id === undefined) return

      console.log('Hi ' + id)
      setSession({_id: peer.id, name: getChatName(peer.id), image: undefined})
      connectToPeer(undefined)

    })
    if (conn !== undefined) return

    peer.on("connection", function (conn) {
      // console.log(conn.peer + ' is online')
      if (!online.includes(conn.peer)) online.push(conn.peer)

      conn.on("data", function (data: MessageType) { //RECIEVED DATA
        if (data.timestamp === "readed") setReadedLastMessage(data._id, data.owner)
        else addMessage(fileCheckToBlob(data))
        // console.log(conn.peer + ' sended you a message', data)
      })

      conn.on('close', function () {
        console.log('connection was closed by ' + conn.peer)
        conn.close()
        conn = undefined
      })
    });
  }

  const getChatName = (id: string) => {
    if (id === undefined) return ""
    return chats[id].name
  }

  const searchMessage = (id: string): (MessageType | undefined | number)[] => {
    let index = -1
    let locatedMessage: MessageType | undefined
    let messages = currentChat !== undefined && chats[currentChat] !== undefined ?
      chats[currentChat].messages :
      conn !== undefined && conn.peer !== undefined && chats[conn.peer] !== undefined ?
        chats[conn.peer].messages : []

    for (let i = 0; i < messages.length; i++) {
      if (messages[i]._id === id) {
        index = i
        locatedMessage = Object.assign({}, messages[i])
        locatedMessage!.answer_message = undefined
        break
      }
    }
    return [locatedMessage, index]
  }

  function sendMessage(text: string) {
    if (currentChat === undefined || peer === undefined || fileInput.current === null) return

    let messageToSend: string = text
    let date = new Date();
    let hour = (date.getHours() < 10) ? '0' + date.getHours() : date.getHours();
    let minutes = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes();

    let answer
    if (Answer !== "") {
      answer = searchMessage(Answer)[0]
      setAnswer("")
    }

    let message_id = `${Math.random() * Math.random()}`

    let messageData: MessageType = {
      _id: message_id,
      owner: peer.id,
      text: messageToSend,
      timestamp: hour + ':' + minutes,
      answer_message: answer
    }

    let fileData : FileType | undefined
    let files = fileInput.current.files
    if(files && files.length > 0){
      const file : File = files[0]
      const blob = new Blob([file], { type: file.type })

      let file_id = message_id + "-" + file.name
      
      fileData = {file: file_id, fileName: file.name, fileType: file.type}
      messageData = {...messageData, fileData : fileData}

      if (conn !== undefined) {// send
        conn.send(blob)
        conn.send(messageData)
      } 

      let fileReader = new FileReader();

      fileReader.onload = function () {
        var uint8Array = new Uint8Array(fileReader.result);
        cachedFile = {...cachedFile, [file_id]: uint8Array}
        addMessage(messageData) // client add
      };
      
      fileReader.readAsArrayBuffer(blob);
    }  
    else if (conn !== undefined && text !== "") { // send and client add without file
      conn.send(messageData)
      addMessage(messageData)
    }
  }

  const changeChat = (id: string) => {
    if (peer === undefined) connection(id)

    if (peer.id === id) return console.log("error: client user id: " + id)

    if (conn !== undefined && conn.peer !== id) conn.close()

    conn = undefined
    if(fileInput.current) fileInput.current.value = ""
    setCurrentChat(id)
    console.log('changeChat', id)
    connectToPeer(id)
  }

  const changeToConfigPage = (inOut: boolean) => {
    setCurrentChat("configuration")
    console.log(inOut ? 'change to config' : "exit config")
  }

  const changeAccount = (value: SessionType) => {
    setSession(value)
  }

  //components

  const ChatList = () => {
    let JSX: JSX.Element[] = []

    const configFunctions = {
      "Configuration": () => {
        console.log("a")
        changeToConfigPage(true)
      },
      "Search chat": (e) => {
        let search = e.currentTarget.parentElement.parentElement.previousSibling as HTMLElement
        if (search === null) return
        let input = search.children[1] as HTMLInputElement
        input.classList.add("expanded")
        input.focus()
      },
      "Select Chats": () => { console.log("clean " + currentChat) },
      "Logout": () => { console.log("delete " + currentChat) }
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

  const Chat = () => {
    const TopChat = () => {
      const configFunctions = {
        "View contact": () => { console.log("view") },
        "Search": (e) => {
          let search = e.currentTarget.parentElement.parentElement.previousSibling as HTMLElement
          if (search === null) return
          let input = search.children[1] as HTMLInputElement
          input.classList.add("expanded")
          input.focus()
        },
        "Mute": () => { 
          if (conn === undefined || conn.peer === undefined) return
          console.log("silence " + conn.peer) 
          // changeChats({ ...chats, [conn.peer]: { ...chats[conn.peer], messages: [], notifications: !chats[conn.peer].notifications } })
        },
        "Background": () => { console.log("changeBackground") },
        "Block": () => { console.log("block " + currentChat) },
        "Clean messages": () => {
          if (conn === undefined || conn.peer === undefined) return
          console.log("cleaning chat: " + conn.peer)
          changeChats({ ...chats, [conn.peer]: { ...chats[conn.peer], messages: [], lastViewMessage_id: "" } })
        },
        "Delete contact": () => { console.log("delete " + currentChat) }
      }

      let chatID = currentChat
      if (chatID === undefined && conn !== undefined && conn.peer !== undefined) chatID = conn.peer


      return <header className='top-chat'>
        {chatID !== undefined && chats[chatID] !== undefined && <div>
          <div><FontAwesomeIcon icon={faUserCircle} /></div>
          <div className='name-chat'>
            <h3>{chats[chatID].name}</h3>
            <h6 className={online.includes(chatID) ? 'status-chat visible' : 'status-chat'}>En linea</h6>
          </div>
        </div>}
        <hr />
        <SearchBar
          searchButton={(query: string) => {
            setSearchs([searchs[0], query])
          }}
          placeholder={"Search message"}
          defaultValue={searchs[1]}
        />
        <ChatConfig mode={"message"} functions={configFunctions} />
      </header>
    }
    const RenderMessages = () => {
      if (conn === undefined
        || conn.peer === undefined
        || chats[conn.peer] === undefined
        || chats[conn.peer].messages.length === 0) return

      let checkLastBoolean = false //last message id has pass, and this will turn true to stop making "seen" messages
      let messages = chats[conn.peer].messages.map(message => {
        let state = true
        if ((checkLastBoolean || chats[conn.peer].lastViewMessage_id === "")
          && chats[conn.peer].messages[chats[conn.peer].messages.length - 1].owner === peer.id) state = false
        if (message._id === chats[conn.peer].lastViewMessage_id) checkLastBoolean = true
        return <Message
          key={Math.random()}
          {...message}
          owner={message.owner === peer.id}
          state={state}
          answerMessage={setAnswer}
          getChatName={getChatName}
          cachedFile={cachedFile}
          searchMessage={searchs[1]}
        />
      })

      return messages
    }

    const InputZone = () => {
      const AnswerZone = () => {
        let message = searchMessage(Answer)[0]

        return message !== undefined && typeof message !== "number" && <div className={Answer !== "" ? 'pop visible' : 'pop'}>
          <div className='answer'>
            <div>
              <h5>{getChatName(message.owner)}</h5>
              <p>{message.text}</p>
            </div>
            <FontAwesomeIcon icon={faXmark} onClick={() => { setAnswer("") }} />
          </div>
        </div>
      }

      let fileBool = fileInput.current && fileInput.current?.value !== ""

      return <section className='input-zone'>
        <label 
          htmlFor='input-file'
          title={fileBool ? "Uploaded File" : ""}
        >
          <input 
            id="input-file"
            ref={fileInput} 
            type="file" 
            accept='image/*' 
            onChange={(e)=>{
              let input = e.currentTarget
              if(input.value !== "") {
                input.nextElementSibling?.classList.add("d-none")
                input.nextElementSibling?.nextElementSibling?.classList.remove("d-none")
              }
              else {
                input.nextElementSibling?.classList.remove("d-none")
                input.nextElementSibling?.nextElementSibling?.classList.add("d-none")
              }
            }}
          />
          <FontAwesomeIcon className={fileBool ? "d-none": ""} icon={faPlusCircle}/>
          <FontAwesomeIcon className={fileBool ? "": "d-none"} icon={faCheckCircle}/>
        </label>
        <button><FontAwesomeIcon icon={faSmile} size='xl' /></button>
        <section className='input'>
          <input ref={inputChat} defaultValue={inputChat.current?.value} onKeyUp={(e) => {
            if (e.key === 'Enter') {
              sendMessage(e.currentTarget.value)
              e.currentTarget.value = ""
            }
          }} />
          <AnswerZone />
        </section>
        <button className='send' onClick={(e) => {
          if (!inputChat.current) return
          sendMessage(inputChat.current.value)
          inputChat.current.value = ""
        }}><FontAwesomeIcon icon={faPaperPlane} /></button>
      </section>
    }

    let isSelectedAChat = conn !== undefined && conn.peer !== undefined && currentChat !== undefined && chats[currentChat] !== undefined

    return <section className='content'>
      {currentChat === "configuration" && session !== undefined ? <ConfigPage
        data={{
          name: session.name,
          password:"useless password",
          image: undefined,
        }}
        changeAccount={changeAccount}
      />
      : <>
      {isSelectedAChat && <TopChat />}
      <div className='chat'>
        <RenderMessages />
        <AlwaysScrollToBottom />
      </div>
      {isSelectedAChat && <InputZone />}
      </>}
    </section>
  }

  //effect

  React.useEffect(() => {
    if (inputChat.current) inputChat.current.focus()
  })

  return <main>
    <ChatList />
    <Chat />
  </main>
}