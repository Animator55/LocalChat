import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

type Props = {
    searchButton: Function
    placeholder: string
    defaultValue: string
}

export default function SearchBar({searchButton, placeholder, defaultValue}: Props) {
    const toggleInput = (e: React.MouseEvent) =>{
        let button = e.currentTarget
        let input = button.nextElementSibling as HTMLInputElement
        input.classList.toggle('expanded') 
        input.focus()
    }
    const cleanInput = (e: React.MouseEvent)=>{
      let input = e.currentTarget.previousSibling as HTMLInputElement
      input.value = ""
    }

  return <section className="input-search">
    <button onClick={toggleInput}>
        <FontAwesomeIcon icon={faMagnifyingGlass} size='xl'/>
    </button>
    <input 
      className={defaultValue !== "" ? "input-expand expanded":"input-expand"} 
      defaultValue={defaultValue} 
      onKeyDown={(e)=>{if(e.key === "Enter") searchButton(e.currentTarget.value)}} 
      placeholder={placeholder}
    />
    <button className="xmark" onClick={cleanInput}>
      <FontAwesomeIcon icon={faXmark}/>
    </button>
  </section>
}