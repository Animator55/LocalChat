import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type Props = {
    confirm:Function
    close:Function
}

export default function AddContact({confirm, close}: Props) {
    const [error, reset] = React.useState<undefined | string>()

    const submit = (e:React.FormEvent) => {
        e.preventDefault();
        let form = e.currentTarget as HTMLFormElement
        let id = form["0"] as HTMLInputElement
        let name = form["1"] as HTMLInputElement

        if (id.value === "" || name.value === "") return reset("Complete all inputs")
        confirm(id.value, name.value)
        close()
    }

    return <section className="pop-add-contact" onClick={(e)=>{if(e.target.className === "pop-add-contact") close()}}>
        <section>
            <button className="close" onClick={()=>{close()}}><FontAwesomeIcon icon={faXmark}/></button>
            <h2>New Contact</h2>
            <hr></hr>
            <section className='log-error'>{error}</section>
            <form onSubmit={submit}>
                <label>User Id</label>
                <input/>
                <label>Name your contact</label>
                <input/>
                <button className='config-confirm' type="submit">Confirm</button>
            </form>
        </section>
    </section>
}