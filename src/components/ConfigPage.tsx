import { faArrowLeft, faEye, faEyeSlash, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

type Props = {
    data: {
        name: string
        password: string
        image: undefined | string
    }
    changeAccount: Function
    close: Function
}

export default function ConfigPage({data, changeAccount, close}: Props) {
    const [passwordVis, setPassVis] = React.useState(true)
    const [localData, setLocalData] = React.useState(data)

    const TopImage = ()=>{
        return <section className='avatar-background'>
            <button className='return' onClick={()=>{close()}}><FontAwesomeIcon icon={faArrowLeft}/></button>
            <div className='avatar' onClick={()=>{
                setLocalData({...localData, "image": undefined})
            }}>
                {data.image !== undefined ? <img src=''/> : <FontAwesomeIcon icon={faUserCircle}/>}
            </div>
        </section>
    }
    
    const Account = ()=>{
        return <section className='config-form'>
            <label>Name</label>
            <input 
                placeholder='User name' 
                defaultValue={localData.name}
                onBlur={(e)=>{
                    setLocalData({...localData, "name": e.currentTarget.value})
                }}
            />
            <label>Password</label>
            <div>
                <input 
                    placeholder='Password' 
                    defaultValue={localData.password}
                    type={passwordVis ? "password" : "text"}
                    onBlur={(e)=>{
                        setLocalData({...localData, "password": e.currentTarget.value})
                    }}
                />
                <button onClick={()=>{setPassVis(!passwordVis)}}>
                    <FontAwesomeIcon icon={passwordVis ? faEyeSlash : faEye}/>
                </button>
            </div>
        </section>
    }
    const Save = ()=>{
        return <button className='config-confirm' onClick={()=>{
            if(data === localData) return
            changeAccount(localData)
        }}>
            Save changes
        </button>
    }

    React.useEffect(()=>{
        setTimeout(()=>{
            let main = document.getElementsByClassName('config-page')[0]
            main.classList.remove("animated")
        }, 900)
    }, [])

    return <section className='config-page animated'>
        <TopImage/>
        <Account/>
        <Save/>
    </section>
}