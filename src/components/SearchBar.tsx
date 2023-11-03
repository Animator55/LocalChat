import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

type Props = {
    searchButton: Function
    placeholder: string
}

export default function SearchBar({searchButton, placeholder}: Props) {
    const toggleInput = (e: React.MouseEvent) =>{
        let button = e.currentTarget
        let input = button.nextElementSibling as HTMLInputElement
        input.classList.toggle('expanded') 
        input.focus()
    }

  return <section className="input-search">
    <button onClick={toggleInput}>
        <FontAwesomeIcon icon={faMagnifyingGlass} size='xl'/>
    </button>
    <input className="input-expand" onChange={()=>{console.log("change")}} placeholder={placeholder}/>
  </section>
}