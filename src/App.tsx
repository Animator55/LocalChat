import React from 'react'
import { ChachedFilesType, ChatList, ChatType, FileType, MessageType, SessionType } from './vite-env'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faCircleNotch, faImage, faMicrophone, faPaperPlane, faPlusCircle, faTrash, faUserCircle, faXmark } from '@fortawesome/free-solid-svg-icons'
import Message from './components/Message'
import Peer from 'peerjs'
import './assets/App.css'
import SearchBar from './components/SearchBar'
import ChatConfig from './components/ChatConfig'
import AlwaysScrollToBottom from './components/AlwaysScrollToBottom'
import ConfigPage from './components/ConfigPage'
import UserPage from './components/UserPage'
import Login from './components/Login'
import Emojis from './components/Emojis'
import ChatListComponent from './components/ChatList'
import { users } from './storage/users'

type Connections = {
  on: Function
  connect: Function
  id: string
  peer: string
}

type StringObj = {
  [key:string] : any
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

const checkValidId = (id: string, password: string)=>{
  let defaultChatsIds = Object.keys(users)
  let result: boolean = false
  for(let i=0; i<defaultChatsIds.length;i++) {
    if(defaultChatsIds[i] === id && users[id].password === password) {
      result = true
      break
    }
  }
  return result
}

let mediaRecorder
let preventSend: boolean = true

const createDate = ()=>{
  let date = new Date();
  let hour = (date.getHours() < 10) ? '0' + date.getHours() : date.getHours();
  let minutes = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes();

  return hour + ":" + minutes
} 
let chats: ChatList | undefined = undefined
let unknownChats: ChatList | undefined = undefined

const changeChats = (value:ChatList)=>{
  chats = value
} 

export default function App() {
  const [session, setSession] = React.useState<undefined | SessionType>(undefined)
  const [currentChat, setCurrentChat] = React.useState<string | undefined>()
  const inputChat = React.useRef(null)
  const [searchs, setSearchs] = React.useState<string[]>(["", ""])
  const [Answer, setAnswer] = React.useState("")

  const [refresh, activateRefresh] = React.useState<number>(0)
  const fileInput = React.useRef<HTMLInputElement | null>(null)

  const fileCheckToBlob = (message:MessageType) : MessageType | undefined =>{
    if(message instanceof Uint8Array){
      let entry = checkNullCachedFile()
      if(entry === null) temporalFile = message
      else {
        cachedFile[entry] = message
        activateRefresh(Math.random())
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

    for (let i = chats[chatID].messages.length - 1; i >= 0; i--) {
      if (chats[chatID].messages[i].owner === owner) {
        message_id = chats[chatID].messages[i]._id
        break
      }
    }

    return message_id
  }

  const createUnknownChat = (data: MessageType)=>{
    let newUnknown: StringObj = {}
    if(unknownChats !== undefined) newUnknown = {...unknownChats}
    else newUnknown = {[data.owner]: {}}
    
    if(newUnknown[data.owner] !== undefined && newUnknown[data.owner]._id !== undefined && newUnknown[data.owner].messages !== undefined) {
      newUnknown[data.owner].messages.push(data)
    }
    else {
      let chatData = {
        id: data.owner,
        name: data.owner,
        messages: [data],
        lastViewMessage_id: "",
        block: false,
      }
      newUnknown[data.owner] = chatData
    }

    unknownChats = newUnknown
    activateRefresh(Math.random())
  }

  const addMessage = (data: MessageType | undefined) => {
    if (conn === undefined || peer === undefined || data === undefined || chats === undefined) return

    let origin = data.owner === peer.id //is the client owner of the message?
    let id = origin ? conn.peer : data.owner

    if(chats[id] !== undefined && !chats[id].block) {
      chats[id].messages.push(data)
      let lastView = origin ? chats[id].lastViewMessage_id : getLastMessageOfOwner(id, peer.id)
      changeChats({ ...chats, [id]: { ...chats[id], messages: chats[id].messages, lastViewMessage_id: lastView } })
      if (data.owner === conn.peer) conn.send({ _id: data._id, owner: peer.id, timestamp: "readed" })
      activateRefresh(Math.random())
    }
    else createUnknownChat(data)
  }

  const setReadedLastMessage = (message_id: string, owner: string) => {
    changeChats({ ...chats, [owner]: { ...chats[owner], lastViewMessage_id: message_id } })
    activateRefresh(Math.random())
  }

  const connectToPeer = (chat: string | undefined) => { // trys to connect to peers, if chat is undefined, func will loop
    if (conn !== undefined) return

    function closeConn() {
      console.log('you changed the chat')
      conn = undefined
    }
    const checkLastMessage = (chat: string) => {
      if (chat === undefined || !chats[chat] || chats[chat].messages.length === 0) return
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
    }
    else for (const key in chats) {
      if (key !== peer.id) {
        console.log('Trying to connect to ' + chats[key].name)
        conn = peer.connect(chats[key])
        conn.on('close', closeConn)
      }
    }
  }
  function connection(id: string, password: string): undefined | string { //crea tu session
    if(!checkValidId(id, password)) return "invalid"
    peer = new Peer(id);
    if (peer === undefined) return

    peer.on('error', function (err) {
      switch (err.type) {
        case 'unavailable-id':
          console.log(id + ' is taken')
          peer = undefined
          break
        case 'peer-unavailable':
          console.log('user offline')
          break
        default:
          conn = undefined
          console.log('an error happened')
      }
      return false;
    })
    peer.on('open', function (id: string) {
      if (peer === undefined || peer.id === undefined) return
      console.log('Hi ' + id)
      setSession({_id: peer.id, password: password, image: undefined})
      changeChats(users[peer.id].chats)
      connectToPeer(undefined)
    })
    if (conn !== undefined) return

    peer.on("connection", function (conn) {
      console.log(conn.peer + ' is online')
      if (!online.includes(conn.peer)) online.push(conn.peer)

      conn.on("data", function (data: MessageType) { //RECIEVED DATA
        if (data.timestamp === "readed") setReadedLastMessage(data._id, data.owner)
        else addMessage(fileCheckToBlob(data))
        console.log("sended to you " + data.owner)
      })

      conn.on('close', function () {
        console.log('connection was closed by ' + conn.peer)
        conn.close()
        conn = undefined
      })
    });
  }

  const getChatName = (id: string) => {
    if (id === undefined || session === undefined || session._id === undefined) return ""

    if(chats[id] !== undefined) return chats[id].name
    else if(users[session._id].chats[id] !== undefined) return users[session._id].chats[id].name
    else return id
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
    let timestamp = createDate()

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
      timestamp: timestamp,
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
      
      if(fileInput.current) fileInput.current.value = ""

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

  function sendAudio (audio){
    if (currentChat === undefined || peer === undefined || audio === "" || !preventSend) return

    if(fileInput.current) fileInput.current.value = ""

    let timestamp = createDate()

    let answer
    if (Answer !== "") {
      answer = searchMessage(Answer)[0]
      setAnswer("")
    }

    let message_id = `${Math.random() * Math.random()}`

    let messageData: MessageType = {
      _id: message_id,
      owner: peer.id,
      text: "",
      audio: audio,
      timestamp: timestamp,
      answer_message: answer
    }

    if (conn !== undefined) { // send and client add without file
      conn.send(messageData)
      addMessage(messageData)
    }
  }

  const changeChat = (id: string | undefined) => {
    if (peer === undefined) connection(id)

    if (peer.id === id) return console.log("error: client user id: " + id)

    if (conn !== undefined && conn.peer !== id) conn.close()

    if(fileInput.current) fileInput.current.value = ""
    setCurrentChat(id)
    console.log('changeChat', id)
    if(id !== "configuration" && id !== "user") {
      conn = undefined
      if(id !== undefined){
        connectToPeer(id)
      }
    }
  }

  const OpenConfigPage = () => {
    setCurrentChat("configuration")
  }

  const changeAccount = (value: SessionType) => {
    setSession(value)
  }

  const StartRecord = ()=>{
    let chunks = [];
    
    if(inputChat.current) inputChat.current.parentElement.parentElement.classList.add("recording-audio")
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorder = new MediaRecorder(stream)

        mediaRecorder.ondataavailable = event => {
          chunks.push(event.data);
        }

        mediaRecorder.onstop = () => {
          if(!preventSend) return
          const blob = new Blob(chunks, { type: 'audio/wav' });
          chunks = [];
          const audioURL = URL.createObjectURL(blob);
          sendAudio(audioURL);
        }

        mediaRecorder.start()
      })
      .catch(err => {
        console.error('Mic error: ', err);
      });
  }

  const StopRecord = (send: boolean)=>{
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      preventSend = send
      if(!preventSend && inputChat.current) inputChat.current.parentElement.parentElement.classList.remove("recording-audio")
      mediaRecorder.stop();
    }
  }

  const NewContact = (value: ChatList, id: string)=>{
    changeChats(value) 
    if(unknownChats !== undefined && unknownChats[id] !== undefined) delete unknownChats[id]
    activateRefresh(Math.random())
  }

  //components

  const Chat = () => {
    const TopChat = () => {
      const configFunctions = {
        "View contact": () => { changeChat("user") },
        "Search": (e) => {
          let search = e.currentTarget.parentElement.parentElement.previousSibling as HTMLElement
          if (search === null) return
          let input = search.children[1] as HTMLInputElement
          input.classList.add("expanded")
          input.focus()
        },
        "Block": () => { 
          if (conn === undefined || conn.peer === undefined) return
          changeChats({ ...chats, [conn.peer]: { ...chats[conn.peer], block: !chats[conn.peer].block } })
          activateRefresh(Math.random())
        },
        "Clean messages": () => {
          if (conn === undefined || conn.peer === undefined) return
          console.log("cleaning chat: " + conn.peer)
          changeChats({ ...chats, [conn.peer]: { ...chats[conn.peer], messages: [], lastViewMessage_id: "" } })
          activateRefresh(Math.random())
        },
        "Delete contact": () => { 
          if (conn === undefined || conn.peer === undefined) return
          console.log("delete chat: " + conn.peer)
          let newChats = {...chats}
          delete newChats[conn.peer]
          changeChats(newChats)
        }
      }

      let chatID = currentChat
      if (chatID === undefined && conn !== undefined && conn.peer !== undefined) chatID = conn.peer


      return <header className='top-chat'>
        {chatID !== undefined && chats[chatID] !== undefined && <div onClick={()=>{configFunctions['View contact']()}}>
          <div><FontAwesomeIcon icon={faUserCircle} /></div>
          <div className='name-chat'>
            <h3>{chats[chatID].name}</h3>
            <h6 className={online.includes(chatID) ? 'status-chat visible' : 'status-chat'}>Online</h6>
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
        || chats === undefined
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

        if(message === undefined || typeof message === "number") return

        let isImage = message.fileData && message.fileData.fileName !== ""
        let isAudio = message.audio && message.audio !== ""

        return <div className={Answer !== "" ? 'pop visible' : 'pop'}>
          <div className='answer'>
            <div>
              <h5>{getChatName(message.owner)}</h5>
              <div>
                {isImage && <FontAwesomeIcon icon={faImage}/>}
                {isAudio && <FontAwesomeIcon icon={faMicrophone}/>}
                {message.text === "" ? 
                    isImage ? <p>Image</p> : isAudio ? <p>Audio</p> : null
                    :
                    <p>{message.text}</p>
                }
              </div>
            </div>
            <FontAwesomeIcon icon={faXmark} onClick={() => { setAnswer("") }} />
          </div>
        </div>
      }

      let fileBool = fileInput.current && fileInput.current?.value !== ""

      const addEmoji = (emoji: string)=>{
        if(!inputChat.current) return
        
        let allText = inputChat.current.value
        let start = inputChat.current.selectionStart
        let end = inputChat.current.selectionEnd
        
        let selectedText = start === end ? undefined : allText.slice(start, end)

        inputChat.current.value = selectedText !== undefined ?
            allText.replace(selectedText, emoji) 
            : 
            allText.slice(0, start) + emoji + allText.slice(end)
        inputChat.current.focus()
      }

      return <section className='input-zone'>
        <button className='delete-audio' onClick={()=>{StopRecord(false)}}>
          <FontAwesomeIcon icon={faTrash} size='xl'/>
        </button>
        <section className='input-record'>
          <FontAwesomeIcon icon={faMicrophone}/>
          <p>Recording...</p>
        </section>
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
        <Emojis addEmoji={addEmoji}/>
        <section className='input'>
          <input ref={inputChat} defaultValue={inputChat.current?.value} onKeyUp={(e) => {
            if (e.key === 'Enter') {
              sendMessage(e.currentTarget.value)
              e.currentTarget.value = ""
            }
          }} />
          <AnswerZone />
        </section>
        {/* <button className='send' onClick={(e) => {
          if (!inputChat.current) return
          sendMessage(inputChat.current.value)
          inputChat.current.value = ""
        }}><FontAwesomeIcon icon={faPaperPlane} /></button> */}
        <button className='record' onClick={()=>{StartRecord()}}>
          <FontAwesomeIcon icon={faMicrophone} size='xl'/>
        </button>
        <button className='send-audio' onClick={()=>{StopRecord(true)}}>
          <FontAwesomeIcon icon={faPaperPlane} size='xl'/>
        </button>
      </section>
    }

    const GeneralRender = ()=>{
      if(session === undefined)return 
      
      if(currentChat === "configuration") return <ConfigPage
        data={{
          _id: session._id,
          password: session.password,
          image: undefined,
        }}
        changeAccount={changeAccount}
        close={()=>{changeChat(conn && conn.peer !== null ? conn.peer : undefined)}}
      />
      else if(currentChat === "user" && conn) return <UserPage
        data={{
          _id: conn.peer,
          name: getChatName(conn.peer),
          image: undefined,
        }}
        close={()=>{changeChat(conn && conn.peer !== null ? conn.peer : undefined)}}
      />
      else return <>
        {isSelectedAChat && <TopChat />}
        <div className='chat'>
          <RenderMessages />
          {isSelectedAChat && chats && chats[conn.peer].block && <div className='blocked-pop'>Blocked</div>}
          <AlwaysScrollToBottom />
        </div>
        {isSelectedAChat && chats && !chats[conn.peer].block && <InputZone />}
      </>
    }

    let isSelectedAChat = conn !== undefined && chats && conn.peer !== undefined && currentChat !== undefined && chats[currentChat] !== undefined

    return <section className='content'>
      <GeneralRender/>
    </section>
  }

  //effect

  React.useEffect(() => {
    if (inputChat.current) inputChat.current.focus()
  })

  React.useEffect(()=>{
    if(session !== undefined && session._id !== undefined) {
      // changeChats(users[session._id].chats)
      document.body.classList.add("loggin-in")
    }
  }, [session])

  return <main>
    {session === undefined ? 
      <Login login={connection}/>
    :<>
      <ChatListComponent 
        peer={peer}
        chats={chats}
        searchs={searchs}
        setSearchs={setSearchs}
        newContact={NewContact}
        changeChat={changeChat}
        OpenConfigPage={OpenConfigPage}
        setSession={setSession}
        unknownChats={unknownChats}
      />
      <Chat />
    </>
    }
    <div className='fade-login'>
      <FontAwesomeIcon icon={faCircleNotch} spin/>
    </div>
  </main>
}