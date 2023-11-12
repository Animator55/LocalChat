import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ChachedFilesType, FileType, MessageType } from '../vite-env'
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
import { faCheckDouble } from '@fortawesome/free-solid-svg-icons/faCheckDouble'
import checkSearch from '../logic/checkSearch'
import encodeImage from '../logic/encodeImage'
import { faImage } from '@fortawesome/free-solid-svg-icons'

type generatedMessage = {
    answerMessage: React.Dispatch<React.SetStateAction<string>>
    getChatName: Function
    searchMessage: string
    _id: string
    text: string
    timestamp: string
    owner: string
    state: boolean
    cachedFile: ChachedFilesType
    answer_message?: MessageType
    fileData?: FileType | undefined
}

export default function Message({_id, text, timestamp, owner, state, answer_message, fileData, cachedFile, answerMessage, getChatName,searchMessage}: generatedMessage) {
    const getImageSrc = (file: string )=>{
        let imgSrc = ""
        if(cachedFile[file] === null) return imgSrc
        imgSrc = 'data:image/png;base64,' + encodeImage(cachedFile[file])
        return imgSrc
    }


    return <div id={_id} className={owner ? 'message owner':'message'} onDoubleClick={()=>{answerMessage(_id)}}>
        { answer_message !== undefined && answer_message !== null ?
            <section className="answer-message">
                <h5>{getChatName(answer_message.owner)}</h5>
                <div>
                    {answer_message.fileData && answer_message.fileData.fileName !== "" && <FontAwesomeIcon icon={faImage}/>}
                    <p dangerouslySetInnerHTML={{__html: checkSearch(answer_message.text, searchMessage)}}></p>
                </div>
            </section> : null
        }
        { fileData !== undefined && fileData.file !== "" &&
            <img 
                // className={imgStyle} 
                src={getImageSrc(fileData.file)} 
                // alt={fileName} 
                // onClick={()=>DisplayImage(image)}
            ></img> 
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