import React from 'react'
import '../assets/Auth.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faG } from '@fortawesome/free-solid-svg-icons'
// import * as Cookie from '../hooks/cookieHandler'

type Props = {
    login: Function
}

export default function Login({login}: Props) {
    const [error, reset] = React.useState<undefined | string>()

    const togglePasswordVisibility = (e: React.MouseEvent) => {
        e.preventDefault()
        if(!e.currentTarget.previousSibling) return 
        let input = e.currentTarget.previousSibling as HTMLInputElement
        let bool = input?.attributes?.type?.value === "password"
        input.setAttribute("type", bool ? "input" : "password")
    }

    const submit = (e:React.FormEvent) => {
        e.preventDefault();
        let form = e.currentTarget
        console.log(e)
        let email = form["0"] as HTMLInputElement
        let password = form["1"] as HTMLInputElement

        if (email.value === "" || password.value === "") return reset("Complete all inputs")
        let result = login(email.value)
        if(result === "invalid") return reset("Invalid password or username")
    }

    // const setCookies = (email, password) =>{
    //     if(email === "" || password === "") return 
    //     // Cookie.set("userId", email)
    //     // Cookie.set("sessionId", "gpomndoagnmdaogfmasodgfmlgds", 3)
    // }

    return <main className="screen animated">
        <section className="form">
            <form onSubmit={submit}>
                <h1>Login</h1>
                <hr />
                <section className='log-error'>{error}</section>
                <ul>
                    <input placeholder={"Username"}/>
                    <div>
                        <input placeholder={"Password"} type={"password"}/>
                        <button className="buttonEye" onClick={togglePasswordVisibility}>
                            <FontAwesomeIcon icon={faEye} /><FontAwesomeIcon icon={faEyeSlash} />
                        </button>
                    </div>
                </ul>
                <a>Don&apos;t have account?</a>
                <button className='config-confirm' type='submit'>Login</button>
            </form>
        </section>
        <section className="page">
            <h1>What is LocalChat?</h1>
            <p>Using <i style={{ color: "red" }}>PeerJS</i> library, LocalChat can bring you the experience of chating with someone in your local network, using peer to peer communication.</p>
        </section>
    </main>
}
