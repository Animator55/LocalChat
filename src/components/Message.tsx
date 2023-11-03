import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MessageType } from '../vite-env'
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
import { faCheckDouble } from '@fortawesome/free-solid-svg-icons/faCheckDouble'

type checkState = {
    [key:string]: any 
}

type generatedMessage = {
    answerMessage: React.Dispatch<React.SetStateAction<string>>
    _id: string
    text: string
    timestamp: string
    owner: string
    state: string
    answer_message?: MessageType
}

export default function Message({_id, text, timestamp, owner, state, answer_message, answerMessage}: generatedMessage) {
    const checkState: checkState = {
        "sended": faCheck,
        "recieved": faCheckDouble,
        "seen": faCheckDouble
    }


    return <div id={_id} className={owner ? 'message owner':'message'} onDoubleClick={()=>{console.log("wtf"); answerMessage(_id)}}>
        {answer_message !== undefined && 
            <section className="answer-message">
                <h5>{answer_message.owner}</h5>
                <p>{answer_message.text}</p>
                <h6>{answer_message.timestamp}</h6>
            </section>
        }
        <p>{text}</p>
        <div>
            <h6>{timestamp}</h6>
            <FontAwesomeIcon icon={checkState[state]} size='xs'/>
        </div>
    </div>
}