import React from 'react'
import { ChatList, ChatType, MessageType } from './vite-env'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical, faGear, faMagnifyingGlass, faPaperPlane, faPhone, faPlus, faSmile, faUserCircle, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import Message from './components/Message'
import Peer from 'peerjs'
import './assets/App.css'
// import {Peer} from './logic/peerjs.min';

const defaultChats: ChatList = {
  "00001": {
    id: "00001",
    name: "Chat 1",
    messages: []
  },
  "00002": {
    id: "00002",
    name: "Chat 2",
    messages: []
  }
}

type Connections = {
  on : Function 
  connect : Function 
  id: string
  peer: string
}


let online: string[] = []
let conn: Connections | undefined
let peer: Connections | undefined
// let callVar

export default function App() {
  const [chats, changeChats] = React.useState<ChatList>(defaultChats)
  const [currentChat, setCurrentChat] = React.useState<string | undefined>()
  const inputChat = React.useRef(null)

  const addMessage = (data:MessageType)=>{
    if(conn === undefined) return
    chats[conn.peer].messages.push(data)
    changeChats({...chats, [conn.peer]: {...chats[conn.peer], messages: chats[conn.peer].messages}})
  }

  const connectToPeer = (chat:string | undefined) => {
    if(conn !== undefined) return

    function closeConn (){
      // changeStatus('')
      console.log('changed the chat')
      // if(callVar !== undefined && conn !== undefined){
      //     callVar.close()
      //     conn.send('close call')
      // } 
      conn = undefined
    }

    if(chat !== undefined){
        console.log('Connecting to ' + chat)
        conn = peer.connect(chat)
        conn.on('close', closeConn)

        if(conn.peer === currentChat) console.log("connecting")
        // if(statusH.current.innerText === ''){
        //     changeStatus('connecting...')
        // }
    }
    else {
        for (const key in chats){
            if(key !== peer.id){
                console.log('Trying to connect to ' + chats[key].name)
                conn = peer.connect(chats[key])
                conn.on('close', closeConn)
            }
        }
        // changeStatus('')
    }
  }
  function connection(id: string){
      peer = new Peer(id);
      if(peer === undefined) return
      
      peer.on('error', function(err){
          switch(err.type){
              case 'unavailable-id':
                  console.log({id: 'Console', text: id + ' is taken', hour: 'now'})
                  peer = undefined
              break
              case 'peer-unavailable':
                  console.log('user offline')
              break
              default:
                  conn = undefined
                  // changeStatus('')
                  console.log({id: 'Console', text: 'an error happened', hour: 'now'})
              }
          return false;
      })
      peer.on('open', function(id:string) {
          if(peer.id !== undefined){
              console.log({'id': 'Console', text: 'Hi ' + id, hour: 'now'})
              // handleChatChanges(id, false)
              connectToPeer(undefined)
          }
      })
      if(conn !== undefined) return

      peer.on("connection", function (conn) {
          console.log(conn.peer + ' is online')
          if(!online.includes(conn.peer)) online.push(conn.peer)
          
          conn.on("data", function (data: MessageType) { //RECIEVED DATA
              // if(conn.peer === currentChat){
              //     // if(statusH.current.innerText !== 'online'){
              //     //     changeStatus('online')
              //     // }
              //     console.log(data)
              // }
              addMessage(data)
              console.log(conn.peer + ' sended you a message')
          })

          // if(conn.peer === currentChat){
          //     if(statusH.current.innerText !== 'online'){
          //         changeStatus('online')
          //     }
          // }

          // peer.on('call', function(call){ 
          //     if(callVar === undefined){
          //         callVar = call
          //         handleMessages({id: 'Console', text: callVar.peer + ' is calling...', hour: 'now'})
          //         console.log(callVar)
          //         Call(()=>{
          //             return styles.callLayer
          //         })
          //         call.on('close', function(){
          //             console.log('call closed1')
          //             callButton = styles.greenButton
          //             Call(()=>{
          //                 return styles.callLayerTransition
          //             }) 
          //             callVar = undefined
          //         })
          //     }
          // })

          conn.on('close', function(){
              if(conn.peer === currentChat){
                  // changeStatus('')
                  console.log({id: 'Console', text: 'connection was closed by ' + conn.peer, hour: 'now'})
              }
              conn.close()
              // if(callVar !== undefined && conn !== undefined){
              //     callVar.close()
              //     conn.send('close call')
              // } 
              conn = undefined
          })
      });
  }


  function sendMessage(text:string) {
    if(currentChat === undefined || peer === undefined || text === "") return

    let messageToSend:string = text
    // if(messageToSend === '' && fileInput.current.files.length < 1) return;
    let date = new Date();
    let hour = (date.getHours() < 10) ? '0' + date.getHours() : date.getHours();
    let minutes = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes();

    let messageData: MessageType = {
      owner: peer.id, 
      text: messageToSend, 
      timestamp: hour+ ':' +minutes, 
      state: 'sended'
    }
    
    if(conn !== undefined) {
      conn.send(messageData)
      addMessage(messageData)
    }

    // if(fileInput.current.files.length > 0){
    //     const file = fileInput.current.files[0]
    //     const blob = new Blob(fileInput.current.files, { type: file.type })

    //     messageData = {id: peer.id, text: encodeURIComponent(messageToSend), hour: hour+ ':' +minutes, file: blob, fileName: file.name, fileSize: '', fileType: file.type, status: 'sended'};
    //     if(conn !== undefined) conn.send(messageData)
    //     var arrayBuffer;
    //     var fileReader = new FileReader();
    //     fileReader.onload = function(event) {
    //         arrayBuffer = event.target.result;
    //         messageData.file = arrayBuffer
    //         handleMessages(messageData)
    //     };
    //     fileReader.readAsArrayBuffer(messageData.file);
    // }
    // else if(file.name !== '') {
    //     messageData = {id: peer.id, text: encodeURIComponent(messageToSend), hour: hour+ ':' +minutes, file: '', fileName: file.name, fileSize: file.size, fileType: '', status: 'sended'};
    //     if(conn !== undefined) conn.send(messageData)
    //     handleMessages(messageData)
    // }
    // else {
        // handleMessages(messageData)
    // }
    // fileInput.current.value = ''; 
    // Uploaded(()=>{
    //     file = {name: '', size: ''}
    //     return [previewFile = styles.NotPreviewFile]
    // });     
    
  }

  const changeChat = (id:string) => {
  if(peer !== undefined){
      if(peer.id !== id){
          if(conn !== undefined && conn.peer !== id){
              conn.close()
              conn = undefined
              setCurrentChat(id)
              console.log('changeChat', id)
              // changeStatus('')
              connectToPeer(id)
          }
          else{
              conn = undefined
              setCurrentChat(id)
              // topBarOption = styles.button
              console.log('changeChat', id)
              // changeStatus('')
              connectToPeer(id)
          }
      }
      else {
          console.log({id: 'Console', text: 'you cant chat with yourself', hour: 'now'})
      }
  }
  else {
      console.log({id: 'Console', text: 'Loggin in with ' + id, hour: 'now'})
      connection(id)
  }
  }


  //components

  const ChatList = ()=>{
    let JSX: JSX.Element[] = []

    for(const id in chats){
      if(peer !== undefined && id === peer.id) continue

      let lastMessage = ""
      console.log(chats, id)
      if(chats[id].messages.length !== 0) lastMessage = chats[id].messages[chats[id].messages.length-1]

      JSX.push(
      <button 
        className='side-button'
        key={Math.random()} 
        onClick={()=>{changeChat(id)}}
      >
        <FontAwesomeIcon icon={faUserCircle}/>
        <div>
          <p>{chats[id].name}</p>
          <div className='sub-title'>
            <h5 className='ellipsis' style={{fontWeight: 100}}>{lastMessage.text}</h5>
            <h5 style={{fontWeight: 100}}>{lastMessage.timestamp}</h5>
          </div>
        </div>
      </button>)
    }

    const AddButton = ()=> {
      return <button className='add-button' onClick={()=>{
        changeChats({...chats, "00003": {id: "00003",name: "Chat 3",messages: []}})
      }}><FontAwesomeIcon icon={faUserPlus}/></button>
    }

    return <aside className='side-bar'>
      <header>
        <button><FontAwesomeIcon icon={faMagnifyingGlass}/></button>
        <button><FontAwesomeIcon icon={faGear}/></button>
      </header>
      <AddButton/>
      <ul className="chat-list">{JSX}</ul>
    </aside>
  }

  const Chat = ()=>{
    const TopChat = ()=>{
      return <header className='top-chat'>
        {currentChat !== undefined && <div>
          <div><FontAwesomeIcon icon={faUserCircle}/></div>
          <div className='name-chat'>
            <h3>{chats[currentChat].name}</h3> 
            <h6 className={online.includes(currentChat) ? 'status-chat visible' : 'status-chat'}>En linea</h6>
          </div>
        </div>}
        <hr/>
        <FontAwesomeIcon icon={faMagnifyingGlass} size='xl'/>
        <FontAwesomeIcon icon={faEllipsisVertical} size='xl'/>
      </header>
    }
    const RenderMessages = ()=>{
      if(conn === undefined || conn.peer === undefined || chats[conn.peer].messages.length === 0) return
      let messages = chats[conn.peer].messages.map(message=>{
        return <Message key={Math.random()} {...message} owner={message.owner === peer.id}/>
      })

      return messages
    }

    const InputZone = ()=>{
      return <section className='input-zone'>
        <button><FontAwesomeIcon icon={faPlus} size='xl'/></button>
        <button><FontAwesomeIcon icon={faSmile} size='xl'/></button>
        <input ref={inputChat} onKeyUp={(e)=>{
          if(e.key === 'Enter') {
            sendMessage(e.currentTarget.value)
            e.currentTarget.value = ""
          }
        }}/>
        <button className='send' onClick={(e)=>{
          let input = e.currentTarget.previousSibling! as HTMLInputElement
          sendMessage(input.value)
          input.value = ""
        }}><FontAwesomeIcon icon={faPaperPlane}/></button>
      </section>
    }

    return <section className='content'>
      {conn !== undefined && conn.peer !== undefined && <TopChat/>}
      <div className='chat'><RenderMessages/></div>
      {conn !== undefined && conn.peer !== undefined && <InputZone/>}
    </section>
  }

  //effect

  React.useEffect(()=>{
    if(inputChat.current) inputChat.current.focus()
  })

  return <main>
    <ChatList/>
    <Chat/>
  </main>
}