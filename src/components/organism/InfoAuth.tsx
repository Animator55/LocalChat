import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

type Props = {}

export default function InfoAuth({ }: Props) {

    return <section className="info">
        <div className="info-background">
            <div className="ball-4"/>
            <div className="ball-1"/>
            <div className="ball-2"/>
            <div className="ball-3"/>
        </div>
        <h2>View this mini project in GitHub!</h2>
        <p>LocalChat is a mini project testing peer to peer connections using peerjs for future projects, specificly one of them was RegBox with its connections with RegBox Pawn. To view more about this old project, there is the link. </p>
        <button><a href="https://github.com/Animator55/LocalChat">See more <FontAwesomeIcon icon={faArrowUpRightFromSquare}/></a></button>
    </section>
}