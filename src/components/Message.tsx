import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FileType, MessageType } from '../vite-env'
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
import { faCheckDouble } from '@fortawesome/free-solid-svg-icons/faCheckDouble'
import checkSearch from '../logic/checkSearch'
import encodeImage from '../logic/encodeImage'

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
    fileData?: FileType | undefined
}

export default function Message({_id, text, timestamp, owner, state, answer_message, fileData, answerMessage, getChatName,searchMessage}: generatedMessage) {
    const getImageSrc = (file: string | ArrayBuffer | Blob | null)=>{
        if(file === null || typeof file === "string") return
        const bytes = new Uint8Array(file)
        let imgSrc = 'data:image/png;base64,' + encodeImage(bytes)
        return imgSrc
    }

    return <div id={_id} className={owner ? 'message owner':'message'} onDoubleClick={()=>{answerMessage(_id)}}>
        { fileData !== undefined && fileData.file !== null ? 
            <img 
                // className={imgStyle} 
                src={getImageSrc(fileData.file)} 
                // alt={fileName} 
                // onClick={()=>DisplayImage(image)}
            ></img>
            : answer_message !== undefined && answer_message !== null ?
            <section className="answer-message">
                <h5>{getChatName(answer_message.owner)}</h5>
                <p dangerouslySetInnerHTML={{__html: checkSearch(answer_message.text, searchMessage)}}></p>
            </section> : null
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