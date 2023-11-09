import { faEye, faEyeSlash, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

type Props = {
    data: {
        name: string
        password: string
        image: undefined | string
    }
    changeAccount: Function
}

export default function ConfigPage({data, changeAccount}: Props) {
    const [passwordVis, setPassVis] = React.useState(true)
    const [localData, setLocalData] = React.useState(data)

    const TopImage = ()=>{
        return <section>
            <div className='avatar-background'></div>
            <div className='avatar' onClick={(e)=>{
                setLocalData({...localData, "image": undefined})
            }}>
                {data.image !== undefined ? <img src=''/> : <FontAwesomeIcon icon={faUserCircle}/>}
            </div>
        </section>
    }
    
    const Account = ()=>{
        return <section>
            <input 
                placeholder='User name' 
                defaultValue={localData.name}
                onBlur={(e)=>{
                    setLocalData({...localData, "name": e.currentTarget.value})
                }}
            />
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
        return <button onClick={()=>{
            if(data === localData) return
            changeAccount(localData)
        }}>
            Save changes
        </button>
    }

    return <section>
        <TopImage/>
        <Account/>
        <Save/>
    </section>
}