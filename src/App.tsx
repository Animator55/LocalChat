import React from 'react'
import { ChatList, ChatType } from './vite-env'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import Message from './components/Message'

const defaultChats = {
  "00001": {
    id: "00001",
    name: "Chat 1",
    messages: []
  }
}

export default function App() {
  const [chats, changeChats] = React.useState<ChatList>(defaultChats)
  const [currentChat, setCurrentChat] = React.useState<ChatType | undefined>()
  const ChatList = ()=>{
    let JSX: JSX.Element[] = []

    for(const id in chats){
      JSX.push(<div key={Math.random()} onClick={()=>{setCurrentChat(chats[id])}}>{chats[id].name}</div>)
    }

    return <aside>
      {JSX}
      <button onClick={()=>{console.log("add")}}><FontAwesomeIcon icon={faPlus}/></button>
    </aside>
  }

  const Chat = ()=>{
    const TopChat = ()=>{
      return <header>

      </header>
    }
    const RenderMessages = ()=>{
      if(currentChat === undefined || currentChat.messages.length === 0) return
      let messages = currentChat.messages.map(message=>{
        return <Message {...message}/>
      })

      return <div>
        {messages}
      </div>
    }

    return <section>
      <TopChat/>
      <RenderMessages/>
    </section>
  }

  return <main>
    <ChatList/>
    <Chat/>
  </main>
}