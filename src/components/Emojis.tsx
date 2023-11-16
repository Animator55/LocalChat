import { faSmile } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

type Props = {
    addEmoji: Function
}

type pagesType = {
    [key:string]: string[]
}

export default function Emojis({addEmoji}: Props) {
    const [toggle, toggleOpen] = React.useState<boolean>(false)
    const [page, setPage] = React.useState<string>("faces")

    const pages : pagesType = {
        // "recently used": [],
        "faces": ['😀', '😊', '😍', '😎', '😇', '😂', '🤣', '😜', '😉', '😋', '😌', '😏', '😬', '🤨', '😐', '😕', '😟', '😮', '😳', '😢', '😭', '😤', '😡', '🤯', '😱', '😵', '🥴', '😷', '🤢', '🤕'],
        "animals": ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🦉', '🦆', '🦄', '🐴', '🐍', '🐢', '🦎', '🐟', '🐙', '🦑', '🦀', '🐝', '🐞'],
        "foods": ['🍔', '🍕', '🌭', '🥪', '🌮', '🌯', '🥗', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🍤', '🍙', '🍚', '🍘', '🥠', '🍢', '🍡', '🍧', '🍨', '🍦', '🍰', '🎂', '🧁', '🥧', '🍮', '🍩'],
        "signs": ['❤️', '💛', '💚', '💙', '💜', '🖤', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉'],
    }

    const RenderPage = ()=>{
        return pages[page].map(emoji=>{
            return <button key={Math.random()}
                onClick={()=>{addEmoji(emoji)}}
            >{emoji}</button >
        })
    }

    const Router =()=>{
        return <nav className='emojis-router'>
            {Object.keys(pages).map(key=>{
                return <button
                    key={Math.random()}
                    onClick={()=>{setPage(key)}}
                >
                    {key}
                </button>
            })}
        </nav>
    }
    
    return <div className="emojis-wrap">
        <button><FontAwesomeIcon icon={faSmile} size='xl' onClick={()=>{toggleOpen(!toggle)}}/></button>
        {toggle && <section>
                <Router/>
                <hr></hr>
                <ul>
                    <RenderPage/>
                </ul>
        </section>}
    </div>
}