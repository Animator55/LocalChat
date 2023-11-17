import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ChachedFilesType, FileType, MessageType } from '../vite-env'
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
import { faCheckDouble } from '@fortawesome/free-solid-svg-icons/faCheckDouble'
import checkSearch from '../logic/checkSearch'
import encodeImage from '../logic/encodeImage'
import { faImage, faMicrophone } from '@fortawesome/free-solid-svg-icons'

type generatedMessage = {
    answerMessage: React.Dispatch<React.SetStateAction<string>>
    getChatName: Function
    searchMessage: string
    _id: string
    text: string
    audio?: any
    timestamp: string
    owner: string
    state: boolean
    cachedFile: ChachedFilesType
    answer_message?: MessageType
    fileData?: FileType | undefined
}

export default function Message({_id, text, audio, timestamp, owner, state, answer_message, fileData, cachedFile, answerMessage, getChatName,searchMessage}: generatedMessage) {
    const getImageSrc = (file: string )=>{
        let imgSrc = ""
        if(cachedFile[file] === null) return imgSrc
        imgSrc = 'data:image/png;base64,' + encodeImage(cachedFile[file])
        return imgSrc
    }

    const Answer = ()=>{
        if(answer_message === undefined || answer_message === null) return
            
        let isImage = answer_message.fileData !== null && answer_message.fileData.fileName !== ""
        let isAudio = answer_message.audio !== null && answer_message.audio !== ""
        
        return <section className="answer-message">
            <h5>{getChatName(answer_message.owner)}</h5>
            <div>
                {isImage && <FontAwesomeIcon icon={faImage}/>}
                {isAudio && <FontAwesomeIcon icon={faMicrophone}/>}
                {answer_message.text === "" ? 
                    isImage ? <p>Image</p> : isAudio ? <p>Audio</p> : null
                    :
                    <p dangerouslySetInnerHTML={{__html: checkSearch(answer_message.text, searchMessage)}}></p>
                }
            </div>
        </section>
    } 

    return <div id={_id} className={owner ? 'message owner':'message'} onDoubleClick={()=>{answerMessage(_id)}}>
        <Answer/>
        { fileData !== undefined && fileData.file !== "" &&
            <img 
                // className={imgStyle} 
                src={getImageSrc(fileData.file)} 
                // alt={fileName} 
                // onClick={()=>DisplayImage(image)}
            ></img> 
        }
        <section className='message-content'>
            {audio !== undefined && audio !== "" ? 
                <audio controls src={audio}/>
                :
                <p dangerouslySetInnerHTML={{__html: checkSearch(text, searchMessage)}}></p>
            }
            <div>
                <h6>{timestamp}</h6>
                {owner && <FontAwesomeIcon icon={state ? faCheckDouble:faCheck} size='xs'/>}
            </div>
        </section>
    </div>
}