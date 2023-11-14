import React from 'react'
import '../assets/Auth.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faG } from '@fortawesome/free-solid-svg-icons'
// import * as Cookie from '../hooks/cookieHandler'

export default function Login() {
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
        let email = form["1"] as HTMLInputElement
        let password = form["2"] as HTMLInputElement

        if (email.value === "" || password.value === "") return
        //Login(email.value, password.value)
    }

    // const setCookies = (email, password) =>{
    //     if(email === "" || password === "") return 
    //     // Cookie.set("userId", email)
    //     // Cookie.set("sessionId", "gpomndoagnmdaogfmasodgfmlgds", 3)
    // }

    return <main className="screen">
        <section className="form">
            <form onSubmit={submit}>
                <h1>Login</h1>
                <hr />
                <button className="logWith"><FontAwesomeIcon icon={faG} />Login with Google</button>
                <ul>
                    <input placeholder={"Email"}/>
                    <div>
                        <input placeholder={"Password"} type={"password"}/>
                        <button className="buttonEye" onClick={togglePasswordVisibility}>
                            <FontAwesomeIcon icon={faEye} /><FontAwesomeIcon icon={faEyeSlash} />
                        </button>
                    </div>
                </ul>
                <a>Don&apos;t have account?</a>
                <button type='submit'>Login</button>
            </form>
        </section>
        <section className="page">
            <h1>What is LocalChat?</h1>
            <p>Using <i style={{ color: "red" }}>PeerJS</i> library, LocalChat can bring you the experience of chating with someone in your local network, using peer to peer communication.</p>
        </section>
    </main>
}
