import { faArrowRightFromBracket, faBan, faBellSlash, faEllipsisVertical, faMagnifyingGlass, faRectangleXmark, faSliders, faSquareCheck, faTrashCan, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

type Props = {
    functions: {[key:string]: Function}
    mode: string
}

type config = {
    [key: string]: any
}

const configsMessage: config = {
    "View contact": faUser, 
    "Search": faMagnifyingGlass, 
    "Mute": faBellSlash, 
    "Block": faBan, 
    "Clean messages": faTrashCan, 
    "Delete contact": faRectangleXmark  
}
const configsChat: config = { 
    "Search chat": faMagnifyingGlass, 
    "Select Chats": faSquareCheck, 
    "Configuration": faSliders, 
    "Logout": faArrowRightFromBracket,
}

export default function ChatConfig({mode, functions}: Props) {
    const toggleInput = (e) =>{
        let button = e.currentTarget
        let list = button.nextElementSibling as HTMLElement
        list.classList.toggle('expanded') 
    }
    const closeInput = (e) =>{
        // let button = e.currentTarget
        // let list = button.nextElementSibling as HTMLElement
        // list.classList.remove('expanded') 
    }

    const ConfigList = ()=>{
        let JSX = []

        let configs: config = {
            "chat": configsChat,
            "message": configsMessage
        }

        for(const key in configs[mode]) {
            JSX.push(<li key={Math.random()} onClick={(e)=>{functions[key](e)}}><FontAwesomeIcon icon={configs[mode][key]}/><p>{key}</p></li>)
        }
        return <ul className='chat-config'>
            {JSX}
        </ul>
    }

    return <section>
        <button onClick={toggleInput} onBlur={closeInput}>
            <FontAwesomeIcon icon={faEllipsisVertical} size='xl'/>
        </button>
        <ConfigList/>
    </section>
}