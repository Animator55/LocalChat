import { faArrowLeft, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type Props = {
    data: {
        name: string
        image: undefined | string
    }
    close: Function
}

export default function UserPage({data, close}: Props) {

    const TopImage = ()=>{
        return <section className='avatar-background'>
            <button className='return' onClick={()=>{close()}}><FontAwesomeIcon icon={faArrowLeft}/></button>
            <div className='avatar'>
                {data.image !== undefined ? <img src=''/> : <FontAwesomeIcon icon={faUserCircle}/>}
            </div>
        </section>
    }

    return <section className='config-page'>
        <TopImage/>
        <div className='user-page'>
            <h2>{data.name}</h2>
        </div>
    </section>
}