import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "../assets/auth.css"
import { faCircleExclamation, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import React from "react";
import { _auth } from "../logic/_auth";
import InfoAuth from "./organism/InfoAuth";


type Props = {
    login: Function
}

export default function Login({ login }: Props) {
    const [error, setError] = React.useState("")

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        let form = e.currentTarget as HTMLFormElement

        let name: string = form["user"].value
        if (name === "") return setError("Complete all inputs.")

        let submit = form["login"]

        submit.classList.add('loading-button')


        // send request ---- then =>

        let result = _auth(name)

        setTimeout(() => {
            submit.classList.remove('loading-button')
            login(result.data)
        }, 500)
    }

    const togglePassword = (e: React.MouseEvent) => {
        let button = e.currentTarget as HTMLButtonElement
        button.classList.toggle('check')

        let input = button.previousElementSibling as HTMLInputElement
        input.type = input.type === "text" ? "password" : "text"
    }

    const LoginComp = () => {
        return <>
            <h1 className="title">Login</h1>
            <hr />

            <section className='error-box'>
                {error !== "" && <FontAwesomeIcon icon={faCircleExclamation} />}
                {error}
            </section>

            <form onSubmit={submit} className='form fade-up' style={{ animationDelay: ".2s" }}>
                <div className='labeled-input'>
                    <label>User</label>
                    <input name='user' defaultValue={"Example Name"} />
                </div>
                <div className='labeled-input'>
                    <label>Password</label>
                    <div className='input-container'>
                        <input name="password" type='password' defaultValue={""} />
                        <button type='button' onClick={togglePassword}>
                            <FontAwesomeIcon icon={faEyeSlash} />
                            <FontAwesomeIcon icon={faEye} />
                        </button>
                    </div>
                </div>

                <button name='login' id="login-button" type='submit' data-text="Confirm"></button>
            </form>
        </>
    }

    return <section className="auth-screen">
        <section className="auth-section">
            <LoginComp />
        </section>
        <InfoAuth />
    </section>
}