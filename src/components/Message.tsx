import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MessageType } from '../vite-env'
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
import { faCheckDouble } from '@fortawesome/free-solid-svg-icons/faCheckDouble'
import checkSearch from '../logic/checkSearch'

type generatedMessage = {
    answerMessage: React.Dispatch<React.SetStateAction<string>>
    getChatName: Function
    searchMessage: string
    _id: string
    text: string
    timestamp: string
    owner: string
    state: boolean
    answer_message?: MessageType
}

export default function Message({_id, text, timestamp, owner, state, answer_message, answerMessage, getChatName,searchMessage}: generatedMessage) {

    return <div id={_id} className={owner ? 'message owner':'message'} onDoubleClick={()=>{answerMessage(_id)}}>
        {answer_message !== undefined && answer_message !== null && 
            <section className="answer-message">
                <h5>{getChatName(answer_message.owner)}</h5>
                <p dangerouslySetInnerHTML={{__html: checkSearch(answer_message.text, searchMessage)}}></p>
            </section>
        }
        <section className='message-content'>
            <p dangerouslySetInnerHTML={{__html: checkSearch(text, searchMessage)}}></p>
            <div>
                <h6>{timestamp}</h6>
                {owner && <FontAwesomeIcon icon={state ? faCheckDouble:faCheck} size='xs'/>}
            </div>
        </section>
    </div>
}