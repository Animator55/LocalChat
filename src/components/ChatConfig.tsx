import { IconDefinition, faBan, faBellSlash, faEllipsisVertical, faImage, faMagnifyingGlass, faRectangleXmark, faTrashCan, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

type Props = {
    functions: {[key:string]: Function}
}

type config = {
    [key: string]: IconDefinition
}

const configs: config = {
    "View contact": faUser, 
    "Search": faMagnifyingGlass, 
    "Mute": faBellSlash, 
    "Background": faImage, 
    "Block": faBan, 
    "Clean messages": faTrashCan, 
    "Delete contact": faRectangleXmark  
}

export default function ChatConfig({functions}: Props) {
    const toggleInput = (e: React.MouseEvent) =>{
        let button = e.currentTarget
        let list = button.nextElementSibling as HTMLElement
        list.classList.toggle('expanded') 
    }

    const ConfigList = ()=>{
        let JSX = []
        for(const key in configs) {
            JSX.push(<li key={Math.random()} onClick={(e)=>{functions[key](e)}}><FontAwesomeIcon icon={configs[key]}/><p>{key}</p></li>)
        }
        return <ul className='chat-config'>
            {JSX}
        </ul>
    }

    return <section>
        <button onClick={toggleInput}>
            <FontAwesomeIcon icon={faEllipsisVertical} size='xl'/>
        </button>
        <ConfigList/>
    </section>
}