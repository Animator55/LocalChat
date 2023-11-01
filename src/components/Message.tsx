import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MessageType } from '../vite-env'
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
import { faCheckDouble } from '@fortawesome/free-solid-svg-icons/faCheckDouble'

type checkState = {
    [key:string]: any 
}

export default function Message({text, timestamp, owner, state}: MessageType) {
    const checkState: checkState = {
        "sended": faCheck,
        "recieved": faCheckDouble,
        "seen": faCheckDouble
    }

    return <div className={owner ? 'message owner':'message'}>
        <p>{text}</p>
        <div>
            <h6>{timestamp}</h6>
            <FontAwesomeIcon icon={checkState[state]} size='xs'/>
        </div>
    </div>
}